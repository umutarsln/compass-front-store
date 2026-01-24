# Ürün Açıklamasında Markdown Formatı Kullanımı

Backend'den gelen ürün açıklaması artık **markdown formatında** desteklenmektedir.

## Desteklenen Formatlar

### Başlıklar
```markdown
# Başlık 1
## Başlık 2
### Başlık 3
```

### Metin Biçimlendirmesi
- **Kalın Metin** → `**metin**`
- *İtalik Metin* → `*metin*`
- ~~Üstü Çizili~~ → `~~metin~~`

### Listeler

#### Sırasız Liste
```markdown
- Eleman 1
- Eleman 2
  - Alt eleman
- Eleman 3
```

#### Sıralı Liste
```markdown
1. İlk adım
2. İkinci adım
3. Üçüncü adım
```

### Bağlantılar
```markdown
[Bağlantı Metni](https://example.com)
```

### Kod Blokları
```markdown
`satır içi kod`

\`\`\`python
# Code block
def hello():
    print("Hello")
\`\`\`
```

### Tırnaklar (Blockquote)
```markdown
> Bu bir alıntıdır
> İkinci satır
```

### Tablolar
```markdown
| Başlık 1 | Başlık 2 |
|----------|----------|
| Hücre 1  | Hücre 2  |
| Hücre 3  | Hücre 4  |
```

### Yatay Çizgi
```markdown
---
```

## Örnek JSON API Yanıtı

```json
{
  "id": "urun-123",
  "name": "Özel Tasarım Lamba",
  "description": "# Premium LED Lamba\n\nBu **özel tasarım lamba**:\n\n- 🌟 Yüksek kalite akrilik malzeme\n- 💡 Ayarlanabilir renk seçenekleri\n- ⚡ Enerji verimli LED teknolojisi\n\n## Özellikler\n\n| Özellik | Değer |\n|---------|-------|\n| Enerji Tüketimi | 5W |\n| Yaşam Süresi | 50.000 saat |\n| Garantisi | 2 yıl |\n\n> **Not:** Ürün USB ile beslenebilir.",
  "price": 349
}
```

## Sitede Görüntülenme

Ürün detay sayfasında "Ürün Hakkında" sekmesi altında, markdown içeriği aşağıdaki şekilde formatlanarak gösterilir:

- Başlıklar, yazı tipi ve renk ile uygun şekilde stilize edilir
- Listeler otomatik olarak bullet veya numaralandırılmış olur
- Kodlar monospace font ile highlight edilir
- Linkler mavi renkte ve tıklanabilir olur
- Tablolar düzenli şekilde gösterilir
- Görüntüler responsive olarak ölçeklendirilir

## Not

Tüm markdown özellikleri `remark-gfm` (GitHub Flavored Markdown) ile desteklenmektedir.
