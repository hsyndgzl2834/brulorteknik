import os
import json
import re

def extract_i18n_keys_from_html(directory):
    i18n_keys = set()
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.html') or file.endswith('.htm'):
                with open(os.path.join(root, file), encoding='utf-8') as f:
                    content = f.read()
                    keys = re.findall(r'data-i18n="([^"]+)"', content)
                    i18n_keys.update(keys)
    return i18n_keys

def extract_keys_from_json(data, parent_key=''):
    keys = set()
    for k, v in data.items():
        new_key = f"{parent_key}.{k}" if parent_key else k
        if isinstance(v, dict):
            keys.update(extract_keys_from_json(v, new_key))
        else:
            keys.add(new_key)
    return keys

def filter_json(data, allowed_keys, parent_key=''):
    result = {}
    for k, v in data.items():
        full_key = f"{parent_key}.{k}" if parent_key else k
        if isinstance(v, dict):
            filtered = filter_json(v, allowed_keys, full_key)
            if filtered:
                result[k] = filtered
        else:
            if full_key in allowed_keys:
                result[k] = v
    return result

def main(directory, tr_json_file, en_json_file):
    # 1. Projedeki kullanılan data-i18n anahtarlarını bul
    used_keys = extract_i18n_keys_from_html(directory)

    # 2. JSON dosyalarını yükle
    with open(os.path.join(directory, tr_json_file), encoding='utf-8') as f:
        tr_json = json.load(f)
    with open(os.path.join(directory, en_json_file), encoding='utf-8') as f:
        en_json = json.load(f)

    # 3. Kullanılan anahtarları filtrele
    tr_cleaned = filter_json(tr_json, used_keys)
    en_cleaned = filter_json(en_json, used_keys)

    # 4. Sonuçları kaydet
    with open(os.path.join(directory, 'tr_cleaned.json'), 'w', encoding='utf-8') as f:
        json.dump(tr_cleaned, f, ensure_ascii=False, indent=2)
    with open(os.path.join(directory, 'en_cleaned.json'), 'w', encoding='utf-8') as f:
        json.dump(en_cleaned, f, ensure_ascii=False, indent=2)
    print("Temizleme tamamlandı! Çıktı dosyaları: tr_cleaned.json, en_cleaned.json")

if __name__ == '__main__':
    main('.', 'tr.json', 'en.json')
