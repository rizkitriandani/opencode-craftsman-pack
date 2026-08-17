# 🛠️ OpenCode Craftsman Pack

> **Eliminate Vibe Coding & Programming by Coincidence.**  
> A pragmatic craftsmanship toolkit for [OpenCode](https://opencode.ai) featuring **Rubberducking**, **Socratic Understanding Gate (Unvibe)**, **Senior Consultant**, and **STAR Work Log (Notion Sync)**.

---

## 🌟 What's Included?

| Tool / Agent | Slash Command | Mode & Role | Mission |
| :--- | :--- | :--- | :--- |
| **🦆 Rubberduck** | `/duck [topik]` | Thinking Mirror | Membedah alur logika dan debugging secara mandiri **tanpa disuapi kode instan** (*Strict No-Code Handouts*). |
| **🛑 Unvibe** | `/unvibe [topik]` | Understanding Gate | Mengaudit `git diff` aktual, mencari mismatch intent vs kode, dan menguji pemahamanmu (*Socratic Grill*) sampai lulus sebelum commit. |
| **👨🏫 Consultant** | `@consultant` | Senior Architect | Mentor arsitektur yang menggunakan *Feynman Technique*, *First Principles*, dan *Understanding Gate*. |
| **📝 STAR Logger** | `/log [topik]` | Portfolio Specialist | Merangkum sesi kerja ke format **STAR (Situation, Task, Action, Result) + Lessons Learned + 60s Interview Pitch**, lalu sync ke database Notion. |
| **💡 Jelasin** | `/jelasin [topik]` | Concept Explainer | Menjelaskan konsep teknis rumit dengan analogi sederhana setara anak SMA (*See-Do-Feedback*). |

---

## 🚀 Cara Instalasi

Pilih salah satu metode berikut sesuai kebutuhan kamu:

### Metode 1: Plugin OpenCode (Direkomendasikan)
Tambahkan ke dalam array `plugin` di file `opencode.json` (bisa di global `~/.config/opencode/opencode.json` atau di level project):

```json
{
  "plugin": [
    "opencode-craftsman-pack@git+https://github.com/rizkitriandani/opencode-craftsman-pack.git"
  ]
}
```
*Setelah ditambahkan, restart OpenCode dan semua agents, commands, dan skills otomatis terpasang.*

### Metode 2: 1-Line Installer Script (Global CLI)
Jalankan perintah ini langsung di terminal untuk memasang semua agent & command ke `~/.config/opencode/`:

```bash
curl -fsSL https://raw.githubusercontent.com/rizkitriandani/opencode-craftsman-pack/main/install.sh | bash
```

Atau jika ingin clone manual:
```bash
git clone https://github.com/rizkitriandani/opencode-craftsman-pack.git
cd opencode-craftsman-pack
./install.sh
```

### Metode 3: Portable per Project Repository
Cukup copy folder `.opencode/` dari repo ini ke root direktori project kamu dan commit ke Git:
```bash
cp -r opencode-craftsman-pack/.opencode /path/to/your-project/
```
Semua anggota tim yang membuka project dengan OpenCode akan langsung mendapatkan akses ke seluruh commands (`/duck`, `/unvibe`, `/log`, dll.) tanpa perlu install global.

---

## 🔄 Robust Pragmatic Workflow

```text
[ 1. CLARIFY & DESIGN ]  ➔  [ 2. TEST-FIRST (TDD) ]  ➔  [ 3. REFACTOR (CLEAN) ]
  • /duck (Rubberduck)         • /tdd (Red-Green)          • /refactor-clean
  • @consultant / /plan        • F.I.R.S.T tests           • Boy Scout Rule
         │                            │                           │
         ▼                            ▼                           ▼
[ 6. LOG & SYNC ]        ◄── [ 5. AUDIT & GATE ]     ◄── [ 4. VERIFY & SECURE ]
  • /log (STAR to Notion)      • /unvibe (Understanding)   • /verify & /test-coverage
  • /update-docs               • /code-review              • /security
```

1. **Jernihkan Logika:** Gunakan `/duck` sebelum coding. Dilarang minta kode instan.
2. **Kunci dengan Test:** Jalankan `/tdd` (Red-Green TDD cycle).
3. **Poles Kerapian:** Jalankan `/refactor-clean` untuk menerapkan Boy Scout Rule & Clean Code.
4. **Verifikasi:** Jalankan `/verify` dan `/security`.
5. **Understanding Gate:** Jalankan `/unvibe`. **Wajib LULUS** membuktikan pemahaman kode sebelum commit.
6. **Dokumentasikan:** Jalankan `/log` untuk simpan catatan STAR ke Notion.

---

## ⚙️ Konfigurasi Tambahan (Notion Sync)

Untuk menggunakan sinkronisasi otomatis `/log` ke database Notion:
1. Pastikan environment variable `NOTION_TOKEN` terpasang, atau terdaftar di `opencode.json` pada bagian MCP Notion.
2. *(Opsional)* Set `NOTION_NOTES_DB_ID` jika ingin mengarah ke database Notion custom kamu (default sudah terhubung ke database `Notes`).

---

## 📜 License
MIT © 2026 OpenCode Craftsman
