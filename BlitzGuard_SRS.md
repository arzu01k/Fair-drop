# Blitz-Guard: Bot-Savar Alisveris Ajani

## Software Requirements Specification (SRS)

**Proje Adi:** Blitz-Guard
**Hackathon:** Monad Blitz - 1-Day IRL Hackathon (Ankara)
**Tema:** Building Consumer Applications on Monad
**Takim:** 4 kisi
**Tarih:** 2026
**Versiyon:** 1.0

---

## 1. Giris

### 1.1 Amac

Bu dokuman, Monad Blitz hackathonu icin gelistirilecek olan **Blitz-Guard** projesinin yazilim gereksinimlerini tanimlar. Blitz-Guard, sinirli stoklu urunlerin (sneaker drops, konser biletleri, limited edition koleksiyonlar) satisa acildigi anda botlarin haksiz avantaj elde etmesini engelleyen, Monad blockchain uzerinde calisan bir **Agentic Alisveris Sistemi**dir.

### 1.2 Problem Tanimi

| Sorun | Aciklama |
|-------|----------|
| **Bot Istilasi** | Sinirli stoklu urunler satisa acildiginda botlar saniyede binlerce islem yaparak stogu tuketiyor |
| **Gas Fee Manipulasyonu** | Klasik blockchain'lerde botlar yuksek gas fee odeyerek islem sirasinda one geciyor (MEV/front-running) |
| **Insan Kullanicilarin Magduriyeti** | Gercek alicilar "Sepete Ekle" butonuna basamadan urunler tukeniyor |
| **Adaletsiz Siralama** | Mevcut sistemler "en cok odeyene" oncelik veriyor, "ilk gelen"e degil |

### 1.3 Cozum Ozeti

Blitz-Guard, Monad'in **paralel execution** kapasitesini kullanarak:
- Kullanicinin adina hareket eden bir **AI Buyer Agent** olusturur
- Kullaniciyi **insan olarak dogrular** ve islemi "Human-Verified Transaction" olarak muhurler
- **Fair Sequencing** ile adaletli bir siralama saglar
- Botlari tespit edip **filtreler**, sadece dogrulanmis insan islemlerini kabul eder

---

## 2. Genel Bakis

### 2.1 Urun Perspektifi

```
+--------------------------------------------------+
|                  BLITZ-GUARD                      |
|                                                   |
|  [Kullanici]                                      |
|      |                                            |
|      v                                            |
|  +------------------+    +--------------------+   |
|  |  Frontend (UI)   |--->|  AI Buyer Agent    |   |
|  |  - Countdown     |    |  - Profil Analizi  |   |
|  |  - Agent Aktive  |    |  - Bot Detection   |   |
|  |  - Sonuc Ekrani  |    |  - Insan Dogrulama |   |
|  +------------------+    +--------------------+   |
|                               |                   |
|                               v                   |
|                    +----------------------+       |
|                    |   Monad Blockchain   |       |
|                    |   (Paralel EVM)      |       |
|                    |   - Fair Sequencing  |       |
|                    |   - Human-Verified   |       |
|                    |     Transactions     |       |
|                    |   - 10,000 TPS       |       |
|                    +----------------------+       |
+--------------------------------------------------+
```

### 2.2 Monad Entegrasyonu - Neden Monad?

| Ozellik | Klasik EVM Zincirleri | Monad |
|---------|----------------------|-------|
| TPS | ~15-30 | **10,000+** |
| Islem Sirasi | Gas fee'ye gore (MEV sorunu) | **Paralel & adil** |
| Drop Ani Kaos | Tikaniyor, fee'ler firlatiyor | **Paralel execution ile yonetiyor** |
| Bot Avantaji | Yuksek gas = onde | **Zamanlama bazli, gas manipulasyonu yok** |

**Kritik Nokta:** Saniyede 10,000 kisinin ayni urune saldirdigi o kaosu sadece Monad'in paralel execution motoru yonetebilir. Bu proje, Monad'in bu gucunu gercek bir tuketici problemine uygulamaktadir.

### 2.3 Kullanici Profili

| Kullanici Tipi | Tanim |
|----------------|-------|
| **Son Kullanici (Alici)** | Limited edition urun almak isteyen gercek insanlar. Kripto bilgisi gerektirmez. |
| **Satici / Marka** | Sinirli stoklu urun satan sirketler (H&M, Nike, bilet platformlari). Botlardan kurtulmak ister. |

### 2.4 Temel Ilkeler

1. **Kullanici kripto ile odeme yapmaz** - Odeme klasik kredi karti ile yapilir
2. **Blockchain gorünmez** - Kullanici blockchain'i hissetmez, sadece adil siralama saglanir
3. **AI ajan kullanici adina hareket eder** - Kullanici niyetini belirtir, ajan uygular
4. **Insan dogrulamasi zorunlu** - Sadece dogrulanmis insanlar islem yapabilir

---

## 3. Fonksiyonel Gereksinimler

### 3.1 Kullanici Kaydi ve Dogrulama

| ID | Gereksinim | Oncelik |
|----|-----------|---------|
| FR-01 | Kullanici wallet baglantisi yapabilmeli (MetaMask / WalletConnect) | Yuksek |
| FR-02 | Kullanici sosyal medya hesabi ile dogrulama yapabilmeli (GitHub, Twitter/X) | Yuksek |
| FR-03 | AI ajan, kullanici profilini analiz ederek "insan skoru" uretmeli | Yuksek |
| FR-04 | Dogrulama sonucu Monad zinciri uzerine "Human-Verified" olarak kaydedilmeli | Yuksek |

### 3.2 AI Buyer Agent (Alisveris Ajani)

| ID | Gereksinim | Oncelik |
|----|-----------|---------|
| FR-05 | Kullanici ajana bir urun ve satis zamanini tanimlayabilmeli | Yuksek |
| FR-06 | Ajan, satis baslama aninda otomatik olarak satin alma talebi olusturmali | Yuksek |
| FR-07 | Ajan, kullanicinin insan dogrulamasini isleme dahil etmeli | Yuksek |
| FR-08 | Ajan durumu kullaniciya gercek zamanli bildirmeli (bekliyor/isleniyor/basarili/basarisiz) | Orta |

### 3.3 Fair Sequencing (Adaletli Siralama)

| ID | Gereksinim | Oncelik |
|----|-----------|---------|
| FR-09 | Islemler Monad uzerinde zaman damgasina gore siralanmali | Yuksek |
| FR-10 | Gas fee manipulasyonu ile one gecme engellemeli | Yuksek |
| FR-11 | Sadece "Human-Verified" islemler kabul edilmeli | Yuksek |
| FR-12 | Bot olarak tespit edilen islemler reddedilmeli | Yuksek |

### 3.4 Satis Simülasyonu (Demo)

| ID | Gereksinim | Oncelik |
|----|-----------|---------|
| FR-13 | "Sale is Starting" geri sayim ekrani gosterilmeli | Yuksek |
| FR-14 | "Activate My Agent" butonu ile ajan aktive edilmeli | Yuksek |
| FR-15 | Canli demo sirasinda paralel islem gorsellestirilmeli | Orta |
| FR-16 | Insan vs Bot islemlerinin sonuclari karsilastirmali gosterilmeli | Orta |

---

## 4. Fonksiyonel Olmayan Gereksinimler

### 4.1 Performans

| ID | Gereksinim |
|----|-----------|
| NFR-01 | Sistem Monad Testnet uzerinde 10,000 TPS'e kadar yukleri desteklemeli |
| NFR-02 | Insan dogrulama sureci 3 saniyeden kisa olmali |
| NFR-03 | Ajan aktivasyonundan isleme kadar gecen sure 2 saniyenin altinda olmali |

### 4.2 Guvenlik

| ID | Gereksinim |
|----|-----------|
| NFR-04 | Insan dogrulama verileri sifrelenmeli |
| NFR-05 | Smart contract'lar reentrancy ve diger bilinen saldiri vektorlerine karsi korunmali |
| NFR-06 | Kullanici ozel anahtarlari hicbir zaman sunucuda saklanmamali |

### 4.3 Kullanilabilirlik

| ID | Gereksinim |
|----|-----------|
| NFR-07 | Kripto bilgisi olmayan kullanicilar sistemi kullanabilmeli |
| NFR-08 | UI mobil uyumlu olmali |
| NFR-09 | Islem durumu kullaniciya acik ve anlasilir sekilde gosterilmeli |

---

## 5. Sistem Mimarisi

### 5.1 Teknoloji Yigini

| Katman | Teknoloji | Aciklama |
|--------|-----------|----------|
| **Frontend** | React / Next.js | Kullanici arayuzu, countdown, agent kontrol paneli |
| **AI Agent** | Python / LangChain veya OpenAI API | Kullanici profil analizi, bot detection, karar verme |
| **Smart Contracts** | Solidity | Monad EVM uzerinde fair sequencing, human verification kaydi |
| **Blockchain** | Monad Testnet | Paralel EVM, yuksek TPS, adil islem sirasi |
| **Wallet** | MetaMask / WalletConnect | Kullanici wallet baglantisi |
| **Backend** | Node.js / Express | API gateway, agent orchestration |

### 5.2 Smart Contract Yapisi

```
contracts/
  |-- BlitzGuard.sol           // Ana kontrat - satis yonetimi
  |-- HumanVerifier.sol        // Insan dogrulama kayitlari
  |-- FairQueue.sol            // Adaletli siralama mekanizmasi
```

#### BlitzGuard.sol - Temel Fonksiyonlar

```solidity
// Pseudo-kod
contract BlitzGuard {
    struct Sale {
        uint256 id;
        string  productName;
        uint256 stock;
        uint256 startTime;
        uint256 sold;
        bool    active;
    }

    struct PurchaseRequest {
        address buyer;
        uint256 saleId;
        uint256 timestamp;
        bool    humanVerified;
        bool    fulfilled;
    }

    mapping(uint256 => Sale) public sales;
    mapping(address => bool) public verifiedHumans;

    function registerAsHuman(bytes calldata proof) external;
    function createSale(string memory product, uint256 stock, uint256 startTime) external;
    function purchaseWithAgent(uint256 saleId) external;
    function isBot(address user) external view returns (bool);
}
```

### 5.3 Akis Diyagrami

```
Kullanici                  AI Agent               Monad Blockchain
   |                          |                          |
   |-- "Su ayakkabiyi al" --> |                          |
   |                          |-- Profil analiz et ----> |
   |                          |<-- Insan skoru: 95 ----- |
   |                          |                          |
   |                          |-- registerAsHuman() ---> |
   |                          |   (Human-Verified TX)    |
   |                          |                          |
   |                          |   [Satis baslar]         |
   |                          |                          |
   |                          |-- purchaseWithAgent() -> |
   |                          |   (Paralel Execution)    |
   |                          |                          |
   |                          |   [Fair Sequencing]      |
   |                          |   [Bot filtreleme]       |
   |                          |                          |
   |                          |<-- TX basarili ----------|
   |<-- "Alin basarili!" -----|                          |
```

---

## 6. Detayli Teknik Tasarim

### 6.1 Proje Klasor Yapisi

```
blitz-guard/
├── frontend/                    # React / Next.js uygulamasi
│   ├── public/
│   │   └── assets/              # Gorseller, ikonlar
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx       # Root layout
│   │   │   └── page.tsx         # Ana sayfa (4 adimli flow)
│   │   ├── components/
│   │   │   ├── WalletConnect.tsx     # MetaMask baglanti butonu
│   │   │   ├── HumanVerify.tsx       # GitHub dogrulama UI
│   │   │   ├── HumanScore.tsx        # AI insan skoru gosterimi
│   │   │   ├── SaleCountdown.tsx     # Geri sayim sayaci
│   │   │   ├── AgentActivator.tsx    # "Activate My Agent" butonu
│   │   │   ├── AgentStatus.tsx       # Agent durum gostergesi
│   │   │   ├── LiveBattle.tsx        # Canli bot vs insan ekrani
│   │   │   ├── StatsPanel.tsx        # TPS, blocked bots istatistik
│   │   │   ├── ResultScreen.tsx      # Basari/basarisizlik sonucu
│   │   │   └── TxLink.tsx            # Monad Explorer TX linki
│   │   ├── hooks/
│   │   │   ├── useWallet.ts          # Wallet baglanti hook'u
│   │   │   ├── useContract.ts        # Smart contract interaction
│   │   │   ├── useAgent.ts           # Agent durumu hook'u
│   │   │   └── useCountdown.ts       # Geri sayim hook'u
│   │   ├── lib/
│   │   │   ├── monad.ts              # Monad Testnet config (RPC, chain ID)
│   │   │   ├── contracts.ts          # ABI ve contract address'leri
│   │   │   └── api.ts                # Backend API cagrilari
│   │   ├── styles/
│   │   │   └── globals.css           # TailwindCSS + custom stiller
│   │   └── types/
│   │       └── index.ts              # TypeScript tip tanimlari
│   ├── package.json
│   ├── tailwind.config.ts
│   └── next.config.js
│
├── backend/                     # Node.js / Express API
│   ├── src/
│   │   ├── index.ts                  # Express server giris noktasi
│   │   ├── routes/
│   │   │   ├── auth.ts               # GitHub OAuth dogrulama
│   │   │   ├── agent.ts              # Agent aktivasyon & durum
│   │   │   ├── sale.ts               # Satis bilgisi & islem
│   │   │   └── verify.ts             # Insan dogrulama endpoint'leri
│   │   ├── services/
│   │   │   ├── githubService.ts      # GitHub API entegrasyonu
│   │   │   ├── agentService.ts       # AI Agent orkestrasyon
│   │   │   ├── blockchainService.ts  # Monad zincir islemleri
│   │   │   └── botSimulator.ts       # Demo icin bot trafik simulasyonu
│   │   ├── middleware/
│   │   │   ├── rateLimiter.ts        # Rate limiting
│   │   │   └── cors.ts               # CORS ayarlari
│   │   └── config/
│   │       ├── monad.ts              # Monad Testnet RPC & wallet config
│   │       └── env.ts                # Environment degiskenleri
│   ├── package.json
│   └── tsconfig.json
│
├── ai-agent/                    # Python AI Agent servisi
│   ├── main.py                       # FastAPI giris noktasi
│   ├── agent/
│   │   ├── buyer_agent.py            # Ana alisveris ajani
│   │   ├── human_analyzer.py         # Profil analiz & insan skoru
│   │   └── bot_detector.py           # Bot tespit algoritmasi
│   ├── models/
│   │   ├── profile.py                # Kullanici profil modeli
│   │   └── score.py                  # Skor hesaplama modeli
│   ├── services/
│   │   ├── github_client.py          # GitHub API veri cekme
│   │   └── chain_client.py           # Monad zincir islemleri (web3.py)
│   ├── requirements.txt
│   └── .env.example
│
├── contracts/                   # Solidity Smart Contracts
│   ├── src/
│   │   ├── BlitzGuard.sol            # Ana kontrat
│   │   ├── HumanVerifier.sol         # Insan dogrulama
│   │   └── FairQueue.sol             # Adaletli siralama
│   ├── test/
│   │   └── BlitzGuard.t.sol          # Contract testleri
│   ├── script/
│   │   └── Deploy.s.sol              # Deployment script
│   └── foundry.toml                  # Foundry config (Monad Testnet)
│
├── bot-simulator/               # Demo icin bot simulasyon scripti
│   ├── simulate.ts                   # Toplu bot islem gonderici
│   └── config.ts                     # Simulasyon parametreleri
│
├── .env.example
├── README.md
└── package.json                 # Root workspace
```

---

### 6.2 Frontend Detayli Tasarim

#### 6.2.1 Ekranlar ve Kullanici Akisi

```
[EKRAN 1: CONNECT]  -->  [EKRAN 2: VERIFY]  -->  [EKRAN 3: SALE]  -->  [EKRAN 4: RESULT]
   Wallet Bagla          Insan Dogrula          Satis & Agent          Sonuc
```

#### 6.2.2 Ekran 1 - Connect & Landing

```
+------------------------------------------------------------------+
|                                                                  |
|              ███████╗ BLITZ-GUARD ███████╗                       |
|              Bot-Savar Alisveris Ajani                           |
|                                                                  |
|    "Botlar degil, insanlar kazanmali."                           |
|                                                                  |
|    +--------------------------------------------------+         |
|    |                                                  |         |
|    |     [  Connect Wallet (MetaMask)  ]             |         |
|    |                                                  |         |
|    |     Powered by Monad - 10,000 TPS               |         |
|    +--------------------------------------------------+         |
|                                                                  |
+------------------------------------------------------------------+
```

**Component:** `WalletConnect.tsx`
- MetaMask popup tetikler
- Monad Testnet'e otomatik network switch (chainId ekler)
- Baglanti basariliysa wallet adresi gosterir, Ekran 2'ye gecer

**Hook:** `useWallet.ts`
```typescript
// Temel yapi
interface WalletState {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  isMonadNetwork: boolean;
}

// Fonksiyonlar
connectWallet()          // MetaMask baglantisi
switchToMonad()          // Monad Testnet'e gecis
disconnectWallet()       // Baglanti kesme
```

#### 6.2.3 Ekran 2 - Human Verification

```
+------------------------------------------------------------------+
|  Wallet: 0x7a3B...f92D                          [Disconnect]     |
|------------------------------------------------------------------|
|                                                                  |
|     ADIM 1: Insan Oldugunu Kanitla                              |
|                                                                  |
|     +----------------------------------------------+            |
|     |  [  Verify with GitHub  ]                    |            |
|     |  [  Verify with Twitter/X  ]  (opsiyonel)    |            |
|     +----------------------------------------------+            |
|                                                                  |
|     +----------------------------------------------+            |
|     |  AI Analiz Sonucu:                           |            |
|     |                                              |            |
|     |  GitHub: @kullanici                          |            |
|     |  - Repos: 47                                 |            |
|     |  - Contributions (son 1 yil): 823            |            |
|     |  - Account Age: 4 yil                        |            |
|     |  - Followers: 156                             |            |
|     |                                              |            |
|     |  ████████████████████░░  Human Score: 92/100 |            |
|     |                                              |            |
|     |  Verdict: HUMAN VERIFIED                     |            |
|     |  TX: 0xabc...def [View on Monad Explorer]    |            |
|     +----------------------------------------------+            |
|                                                                  |
|     [  Continue to Sale  >>  ]                                   |
|                                                                  |
+------------------------------------------------------------------+
```

**Component:** `HumanVerify.tsx`
- GitHub OAuth popup acar
- Backend'e token gonderir
- AI Agent'tan skor bekler

**Component:** `HumanScore.tsx`
- Animated progress bar ile skor gosterir
- Skor >= 70 ise yesil "VERIFIED", < 70 ise kirmizi "SUSPICIOUS"
- On-chain TX hash'i gosterir

#### 6.2.4 Ekran 3 - Sale Dashboard & Agent

```
+------------------------------------------------------------------+
|  Wallet: 0x7a3B...f92D    Status: Human Verified                |
|------------------------------------------------------------------|
|                                                                  |
|  +----------------------------+  +----------------------------+  |
|  |                            |  |                            |  |
|  |  [URUN GORSELI]           |  |  NIKE AIR MAX LIMITED      |  |
|  |                            |  |  Edition: Blitz Special    |  |
|  |                            |  |  Stock: 100 pairs          |  |
|  |                            |  |  Price: $220               |  |
|  +----------------------------+  +----------------------------+  |
|                                                                  |
|  +------------------------------------------------------------+  |
|  |                                                            |  |
|  |        SALE STARTS IN                                      |  |
|  |        ┌────┐  ┌────┐  ┌────┐                             |  |
|  |        │ 00 │: │ 02 │: │ 37 │                             |  |
|  |        └────┘  └────┘  └────┘                             |  |
|  |         hrs      min     sec                               |  |
|  |                                                            |  |
|  +------------------------------------------------------------+  |
|                                                                  |
|  +------------------------------------------------------------+  |
|  |                                                            |  |
|  |   Agent Status: STANDBY                                   |  |
|  |                                                            |  |
|  |   [>>>>>> ACTIVATE MY AGENT <<<<<<]                       |  |
|  |                                                            |  |
|  |   Agent aktive edildiginde, satis basladiginda             |  |
|  |   otomatik olarak satin alma islemi yapacaktir.            |  |
|  |                                                            |  |
|  +------------------------------------------------------------+  |
|                                                                  |
+------------------------------------------------------------------+

--- Agent aktive edildikten sonra ---

|  +------------------------------------------------------------+  |
|  |   Agent Status: ARMED & READY                              |  |
|  |   Waiting for sale to start...                             |  |
|  |   Your position will be secured by Monad Fair Queue        |  |
|  +------------------------------------------------------------+  |
```

**Component:** `SaleCountdown.tsx`
- Smart contract'tan satis baslama zamanini okur
- Animated flip-clock style countdown
- 0'a ulasinca otomatik olarak LiveBattle ekranina gecer

**Component:** `AgentActivator.tsx`
- Buyuk, parlayan buton
- Tiklaninca backend'e agent aktivasyon istegi gonderir
- Buton durumu degisir: "STANDBY" -> "ARMED & READY"

#### 6.2.5 Ekran 3b - Live Battle (Satis Ani)

```
+------------------------------------------------------------------+
|                   SALE IS LIVE!                                   |
|------------------------------------------------------------------|
|                                                                  |
|  REAL-TIME BATTLE                                                |
|  +------------------------------------------------------------+  |
|  |                                                            |  |
|  |  Total Requests     ████████████████████  5,847            |  |
|  |  Bots Blocked       ████████████████      4,203  (71.8%)  |  |
|  |  Humans Processed   ████                  1,644  (28.2%)  |  |
|  |                                                            |  |
|  |  Monad TPS:  ⚡ 8,421                                     |  |
|  |  Stock Left: 23 / 100                                      |  |
|  |                                                            |  |
|  +------------------------------------------------------------+  |
|                                                                  |
|  YOUR AGENT                                                      |
|  +------------------------------------------------------------+  |
|  |                                                            |  |
|  |  Status: PROCESSING                                        |  |
|  |  Queue Position: #67                                       |  |
|  |  ██████████████░░░░░░░░░░░░  Processing...                |  |
|  |                                                            |  |
|  |  [Live TX Stream]                                          |  |
|  |  > 0xf2a... Human-Verified  ACCEPTED   #61                |  |
|  |  > 0x8b1... Bot Detected    REJECTED                      |  |
|  |  > 0x3c7... Bot Detected    REJECTED                      |  |
|  |  > 0xa91... Human-Verified  ACCEPTED   #62                |  |
|  |  > 0x7a3... (YOU) Human     PROCESSING #67                |  |
|  |                                                            |  |
|  +------------------------------------------------------------+  |
|                                                                  |
+------------------------------------------------------------------+
```

**Component:** `LiveBattle.tsx`
- WebSocket ile backend'den gercek zamanli veri alir
- Animated bar chart'lar
- Her yeni islem icin satir eklenir (auto-scroll)

**Component:** `StatsPanel.tsx`
- TPS, blocked bots, processed humans sayaclari
- Sayilar canli olarak artar (animated counter)
- Stock azaldikca kirmiziya doner

#### 6.2.6 Ekran 4 - Result

```
+------------------------------------------------------------------+
|                                                                  |
|     ╔══════════════════════════════════════╗                     |
|     ║     PURCHASE SUCCESSFUL!            ║                     |
|     ╚══════════════════════════════════════╝                     |
|                                                                  |
|     You got: Nike Air Max Limited                                |
|     Your queue position: #67                                     |
|     Stock available: 100 -> You made it!                         |
|                                                                  |
|     +--------------------------------------------------+        |
|     |  BATTLE SUMMARY                                  |        |
|     |                                                  |        |
|     |  Total requests:    5,847                        |        |
|     |  Bots blocked:      4,203  (71.8%)               |        |
|     |  Humans served:     100    (fair queue)           |        |
|     |  Your wait time:    1.2 seconds                  |        |
|     |  Monad peak TPS:    9,247                        |        |
|     +--------------------------------------------------+        |
|                                                                  |
|     [View TX on Monad Explorer]                                  |
|     [Share on Twitter: "I beat the bots with Blitz-Guard!"]     |
|                                                                  |
+------------------------------------------------------------------+
```

**Component:** `ResultScreen.tsx`
- Confetti animasyonu (basarili ise)
- Ozet istatistikler
- Monad Explorer linki
- Twitter share butonu (viral potansiyel)

#### 6.2.7 Frontend Teknoloji Detaylari

| Teknoloji | Kullanim | Neden? |
|-----------|----------|--------|
| **Next.js 14** | App Router, SSR | Hizli setup, modern React |
| **TailwindCSS** | Styling | Hizli UI gelistirme, hackathon icin ideal |
| **viem + wagmi** | Wallet & contract interaction | Modern, type-safe Ethereum kutuphanesi |
| **framer-motion** | Animasyonlar | Countdown, progress bar, confetti |
| **socket.io-client** | WebSocket | Canli battle veri akisi |
| **react-hot-toast** | Bildirimler | Agent durum bildirimleri |

#### 6.2.8 Monad Testnet Network Config

```typescript
// lib/monad.ts
export const monadTestnet = {
  id: 10143,               // Monad Testnet chain ID
  name: "Monad Testnet",
  network: "monad-testnet",
  nativeCurrency: {
    name: "MON",
    symbol: "MON",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://testnet-rpc.monad.xyz"],
    },
  },
  blockExplorers: {
    default: {
      name: "Monad Explorer",
      url: "https://testnet.monadexplorer.com",
    },
  },
};
```

---

### 6.3 Backend Detayli Tasarim

#### 6.3.1 API Endpoint'leri

```
BASE URL: http://localhost:3001/api

AUTH
  POST   /auth/github           # GitHub OAuth baslat
  GET    /auth/github/callback   # GitHub OAuth callback
  GET    /auth/status            # Dogrulama durumu kontrol

VERIFY
  POST   /verify/analyze         # AI agent'a profil gonder, skor al
  POST   /verify/register        # Insan dogrulamasini on-chain kaydet
  GET    /verify/:address        # Adresin dogrulama durumunu sorgula

AGENT
  POST   /agent/activate         # Agent'i aktive et (satis icin hazirla)
  GET    /agent/status/:id       # Agent durumunu sorgula
  POST   /agent/purchase         # Satin alma islemi tetikle

SALE
  GET    /sale/active             # Aktif satislari listele
  GET    /sale/:id                # Satis detayi
  GET    /sale/:id/stats          # Canli istatistikler
  POST   /sale/create             # Yeni satis olustur (admin)

WEBSOCKET
  WS     /ws/battle              # Canli battle veri akisi
```

#### 6.3.2 API Veri Modelleri

```typescript
// Kullanici Dogrulama
interface VerificationRequest {
  walletAddress: string;
  githubToken: string;
}

interface VerificationResponse {
  walletAddress: string;
  humanScore: number;            // 0-100
  isVerified: boolean;           // score >= 70
  githubData: {
    username: string;
    repos: number;
    contributions: number;
    accountAge: number;          // yil
    followers: number;
  };
  txHash: string;                // Monad TX hash
}

// Agent
interface AgentActivation {
  walletAddress: string;
  saleId: number;
  agentId: string;               // unique agent ID
  status: "standby" | "armed" | "processing" | "completed" | "failed";
}

// Satis
interface Sale {
  id: number;
  productName: string;
  stock: number;
  sold: number;
  startTime: number;             // Unix timestamp
  active: boolean;
}

// Canli Battle WebSocket Event'leri
interface BattleEvent {
  type: "new_request" | "bot_blocked" | "human_accepted" | "purchase_complete";
  address: string;
  isBot: boolean;
  isHumanVerified: boolean;
  queuePosition?: number;
  timestamp: number;
}

// Istatistikler
interface BattleStats {
  totalRequests: number;
  botsBlocked: number;
  humansProcessed: number;
  stockLeft: number;
  currentTPS: number;
}
```

#### 6.3.3 Backend Servisler

**githubService.ts** - GitHub API Entegrasyonu
```typescript
// GitHub'dan kullanici verisi ceker
async function getGitHubProfile(token: string) {
  // GET https://api.github.com/user
  // GET https://api.github.com/user/repos
  // GET https://api.github.com/users/:username/events
  // Return: repos, contributions, account age, followers
}
```

**agentService.ts** - Agent Orkestrasyon
```typescript
// Agent yasam dongusu yonetimi
class AgentService {
  activateAgent(walletAddress, saleId)    // Agent'i hazir konuma getir
  monitorSaleStart(saleId)                // Satis baslamasini izle
  executePurchase(agentId)                // Satin alma islemi yap
  getAgentStatus(agentId)                 // Durum sorgula
}
```

**blockchainService.ts** - Monad Zincir Islemleri
```typescript
// Monad Testnet ile etkilesim (ethers.js / viem)
class BlockchainService {
  registerHuman(address, proof)            // HumanVerifier.registerAsHuman()
  createSale(product, stock, startTime)    // BlitzGuard.createSale()
  submitPurchase(saleId, address)          // BlitzGuard.purchaseWithAgent()
  isVerified(address)                      // HumanVerifier.isVerified()
  getSaleInfo(saleId)                      // BlitzGuard.sales()
}
```

**botSimulator.ts** - Bot Trafik Simulasyonu (Demo icin)
```typescript
// Demo sirasinda sahte bot trafigi olusturur
class BotSimulator {
  startSimulation(saleId, intensity)       // Bot saldirisi baslar
  // - Rastgele wallet'lardan islem gonderir
  // - humanVerified = false olarak islem yapar
  // - Smart contract tarafindan reddedilir
  // - WebSocket uzerinden canli olarak gosterilir
  stopSimulation()
}
```

#### 6.3.4 WebSocket Canli Veri Akisi

```
Client (Frontend)                    Server (Backend)
     |                                     |
     |-- connect /ws/battle ------------>  |
     |                                     |
     |<-- event: battle_start ------------ |  (satis basladi)
     |                                     |
     |<-- event: new_request  ------------ |  { address, isBot: true }
     |<-- event: bot_blocked  ------------ |  { address, reason }
     |<-- event: new_request  ------------ |  { address, isBot: false }
     |<-- event: human_accepted ---------- |  { address, queuePos: 67 }
     |<-- event: stats_update ------------ |  { totalReq, blocked, ... }
     |     ...her 500ms tekrarlar...       |
     |                                     |
     |<-- event: purchase_complete ------- |  { address: YOU, success }
     |<-- event: battle_end -------------- |  (satis bitti / stok tukendi)
     |                                     |
```

---

### 6.4 AI Agent Detayli Tasarim

#### 6.4.1 Agent Mimarisi

```
+--------------------------------------------------+
|              AI BUYER AGENT                       |
|                                                   |
|  +------------------+                             |
|  | Human Analyzer   |  GitHub verisi alir         |
|  | - Repo sayisi    |  Profil analiz eder         |
|  | - Aktivite       |  Insan skoru uretir         |
|  | - Hesap yasi     |                             |
|  +--------+---------+                             |
|           |                                       |
|           v                                       |
|  +------------------+                             |
|  | Bot Detector     |  Supheli pattern'lari arar  |
|  | - Yeni hesap?    |  Bot skor uretir            |
|  | - Aktivite yok?  |  Karar: BOT / HUMAN        |
|  | - Toplu islem?   |                             |
|  +--------+---------+                             |
|           |                                       |
|           v                                       |
|  +------------------+                             |
|  | Buyer Agent      |  Satin alma karari verir    |
|  | - Satis izle     |  Monad'a TX gonderir        |
|  | - Zamanlama      |  Sonuc bildirir             |
|  | - TX gonder      |                             |
|  +------------------+                             |
+--------------------------------------------------+
```

#### 6.4.2 Insan Skor Algoritmasi

```python
# human_analyzer.py

def calculate_human_score(github_data: dict) -> int:
    score = 0

    # Repo sayisi (maks 25 puan)
    repos = github_data["public_repos"]
    if repos >= 20:
        score += 25
    elif repos >= 10:
        score += 20
    elif repos >= 5:
        score += 15
    elif repos >= 1:
        score += 10

    # Hesap yasi (maks 25 puan)
    account_age_years = github_data["account_age_years"]
    if account_age_years >= 3:
        score += 25
    elif account_age_years >= 1:
        score += 20
    elif account_age_years >= 0.5:
        score += 10

    # Contribution aktivitesi (maks 25 puan)
    contributions = github_data["contributions_last_year"]
    if contributions >= 500:
        score += 25
    elif contributions >= 200:
        score += 20
    elif contributions >= 50:
        score += 15
    elif contributions >= 10:
        score += 10

    # Follower sayisi (maks 15 puan)
    followers = github_data["followers"]
    if followers >= 50:
        score += 15
    elif followers >= 10:
        score += 10
    elif followers >= 3:
        score += 5

    # Profil bütünlüğü (maks 10 puan)
    if github_data.get("bio"):
        score += 3
    if github_data.get("company"):
        score += 3
    if github_data.get("location"):
        score += 2
    if github_data.get("blog"):
        score += 2

    return min(score, 100)

# Karar
# score >= 70 -> HUMAN VERIFIED
# score 40-69 -> SUSPICIOUS (ek dogrulama gerekli)
# score < 40  -> LIKELY BOT (reddedilir)
```

#### 6.4.3 Bot Detection Kriterleri

```python
# bot_detector.py

def detect_bot(address: str, tx_history: list) -> dict:
    bot_signals = []

    # 1. Islem frekansi kontrolu
    # Son 10 saniyede 5'ten fazla islem -> bot sinyali
    recent_txs = count_recent_transactions(address, window=10)
    if recent_txs > 5:
        bot_signals.append("high_frequency")

    # 2. Human verification kontrolu
    if not is_human_verified(address):
        bot_signals.append("not_verified")

    # 3. Wallet yasi
    wallet_age = get_wallet_age(address)
    if wallet_age < 24 * 3600:  # 1 gunden yeni
        bot_signals.append("new_wallet")

    # 4. Ayni urun icin tekrarli islem
    duplicate_attempts = count_duplicate_purchases(address)
    if duplicate_attempts > 1:
        bot_signals.append("duplicate_attempt")

    is_bot = len(bot_signals) >= 2 or "not_verified" in bot_signals

    return {
        "address": address,
        "is_bot": is_bot,
        "signals": bot_signals,
        "confidence": len(bot_signals) / 4 * 100
    }
```

#### 6.4.4 AI Agent API Endpoint'leri

```
BASE URL: http://localhost:8000

POST   /analyze          # GitHub profil analizi -> insan skoru
POST   /detect           # Bot detection kontrolu
POST   /agent/create     # Yeni buyer agent olustur
POST   /agent/execute    # Satin alma islemi calistir
GET    /agent/:id        # Agent durumu
GET    /health           # Servis sagligi
```

---

### 6.5 Smart Contract Detayli Tasarim

#### 6.5.1 HumanVerifier.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract HumanVerifier {
    address public owner;

    struct Verification {
        bool isVerified;
        uint256 humanScore;       // 0-100
        uint256 verifiedAt;       // timestamp
        string githubUsername;    // GitHub kullanici adi
    }

    mapping(address => Verification) public verifications;
    mapping(address => bool) public authorizedVerifiers;  // Backend wallet'lari

    event HumanVerified(address indexed user, uint256 score, string github);
    event VerificationRevoked(address indexed user);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyVerifier() {
        require(authorizedVerifiers[msg.sender], "Not authorized verifier");
        _;
    }

    constructor() {
        owner = msg.sender;
        authorizedVerifiers[msg.sender] = true;
    }

    function registerAsHuman(
        address user,
        uint256 score,
        string calldata github
    ) external onlyVerifier {
        require(score >= 70, "Score too low");

        verifications[user] = Verification({
            isVerified: true,
            humanScore: score,
            verifiedAt: block.timestamp,
            githubUsername: github
        });

        emit HumanVerified(user, score, github);
    }

    function isVerified(address user) external view returns (bool) {
        return verifications[user].isVerified;
    }

    function getScore(address user) external view returns (uint256) {
        return verifications[user].humanScore;
    }

    function addVerifier(address verifier) external onlyOwner {
        authorizedVerifiers[verifier] = true;
    }
}
```

#### 6.5.2 FairQueue.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract FairQueue {
    struct QueueEntry {
        address buyer;
        uint256 timestamp;
        uint256 position;
        bool processed;
    }

    mapping(uint256 => QueueEntry[]) public saleQueues;  // saleId -> queue
    mapping(uint256 => uint256) public queueLengths;

    event AddedToQueue(uint256 indexed saleId, address buyer, uint256 position);
    event ProcessedFromQueue(uint256 indexed saleId, address buyer, uint256 position);

    function addToQueue(uint256 saleId, address buyer) internal returns (uint256) {
        uint256 position = queueLengths[saleId];
        saleQueues[saleId].push(QueueEntry({
            buyer: buyer,
            timestamp: block.timestamp,
            position: position,
            processed: false
        }));
        queueLengths[saleId]++;

        emit AddedToQueue(saleId, buyer, position);
        return position;
    }

    function getQueuePosition(uint256 saleId, address buyer)
        external view returns (uint256)
    {
        QueueEntry[] storage queue = saleQueues[saleId];
        for (uint256 i = 0; i < queue.length; i++) {
            if (queue[i].buyer == buyer) return queue[i].position;
        }
        revert("Not in queue");
    }
}
```

#### 6.5.3 BlitzGuard.sol (Ana Kontrat)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./HumanVerifier.sol";
import "./FairQueue.sol";

contract BlitzGuard is FairQueue {
    HumanVerifier public verifier;
    address public owner;

    struct Sale {
        uint256 id;
        string productName;
        uint256 totalStock;
        uint256 sold;
        uint256 startTime;
        bool active;
    }

    struct Purchase {
        address buyer;
        uint256 saleId;
        uint256 queuePosition;
        uint256 purchasedAt;
    }

    uint256 public saleCounter;
    mapping(uint256 => Sale) public sales;
    mapping(uint256 => mapping(address => bool)) public hasPurchased;
    Purchase[] public allPurchases;

    // Istatistikler (demo icin)
    uint256 public totalRequests;
    uint256 public botsBlocked;
    uint256 public humansProcessed;

    event SaleCreated(uint256 indexed saleId, string product, uint256 stock, uint256 startTime);
    event PurchaseSuccessful(uint256 indexed saleId, address buyer, uint256 position);
    event BotBlocked(uint256 indexed saleId, address bot);
    event SaleSoldOut(uint256 indexed saleId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address _verifier) {
        owner = msg.sender;
        verifier = HumanVerifier(_verifier);
    }

    function createSale(
        string memory product,
        uint256 stock,
        uint256 startTime
    ) external onlyOwner returns (uint256) {
        uint256 saleId = saleCounter++;
        sales[saleId] = Sale({
            id: saleId,
            productName: product,
            totalStock: stock,
            sold: 0,
            startTime: startTime,
            active: true
        });
        emit SaleCreated(saleId, product, stock, startTime);
        return saleId;
    }

    function purchaseWithAgent(uint256 saleId) external {
        totalRequests++;

        Sale storage sale = sales[saleId];
        require(sale.active, "Sale not active");
        require(block.timestamp >= sale.startTime, "Sale not started");
        require(sale.sold < sale.totalStock, "Sold out");
        require(!hasPurchased[saleId][msg.sender], "Already purchased");

        // BOT KONTROLU: Sadece dogrulanmis insanlar gecebilir
        if (!verifier.isVerified(msg.sender)) {
            botsBlocked++;
            emit BotBlocked(saleId, msg.sender);
            revert("Not human-verified: bot detected");
        }

        // Adaletli siraya ekle
        uint256 position = addToQueue(saleId, msg.sender);

        // Satin alma islemi
        sale.sold++;
        hasPurchased[saleId][msg.sender] = true;
        humansProcessed++;

        allPurchases.push(Purchase({
            buyer: msg.sender,
            saleId: saleId,
            queuePosition: position,
            purchasedAt: block.timestamp
        }));

        emit PurchaseSuccessful(saleId, msg.sender, position);

        // Stok bittiyse satisi kapat
        if (sale.sold >= sale.totalStock) {
            sale.active = false;
            emit SaleSoldOut(saleId);
        }
    }

    // View fonksiyonlari (frontend icin)
    function getSaleStats(uint256 saleId) external view returns (
        uint256 stock,
        uint256 sold,
        bool active
    ) {
        Sale storage sale = sales[saleId];
        return (sale.totalStock, sale.sold, sale.active);
    }

    function getBattleStats() external view returns (
        uint256 _totalRequests,
        uint256 _botsBlocked,
        uint256 _humansProcessed
    ) {
        return (totalRequests, botsBlocked, humansProcessed);
    }
}
```

#### 6.5.4 Deployment & Test

```
# Foundry ile Monad Testnet'e deploy

# .env
MONAD_RPC_URL=https://testnet-rpc.monad.xyz
PRIVATE_KEY=<deployer-wallet-private-key>

# Deploy komutu
forge create --rpc-url $MONAD_RPC_URL \
  --private-key $PRIVATE_KEY \
  src/HumanVerifier.sol:HumanVerifier

forge create --rpc-url $MONAD_RPC_URL \
  --private-key $PRIVATE_KEY \
  src/BlitzGuard.sol:BlitzGuard \
  --constructor-args <HumanVerifier_Address>

# Test
forge test --rpc-url $MONAD_RPC_URL -vvv
```

---

### 6.6 Bot Simulator (Demo Araci)

```typescript
// bot-simulator/simulate.ts
// Demo sirasinda sahte bot trafigi olusturur

import { ethers } from "ethers";

interface SimulationConfig {
  saleId: number;
  botCount: number;              // Kac bot simulasyonu
  requestsPerSecond: number;     // Saniyede kac istek
  duration: number;              // Kac saniye sursin
}

async function runBotSimulation(config: SimulationConfig) {
  const provider = new ethers.JsonRpcProvider("https://testnet-rpc.monad.xyz");

  // Rastgele wallet'lar olustur (botlar)
  const bots = Array.from({ length: config.botCount }, () =>
    ethers.Wallet.createRandom().connect(provider)
  );

  console.log(`Starting bot simulation: ${config.botCount} bots`);
  console.log(`Target: Sale #${config.saleId}`);
  console.log(`Rate: ${config.requestsPerSecond} req/sec`);

  const interval = 1000 / config.requestsPerSecond;

  for (let i = 0; i < config.botCount; i++) {
    setTimeout(async () => {
      try {
        // Bot islem gonderir - Human-Verified OLMADIGI icin
        // smart contract tarafindan reddedilir
        const tx = await contract.connect(bots[i]).purchaseWithAgent(config.saleId);
        // Bu islem REVERT edecek: "Not human-verified: bot detected"
      } catch (error) {
        // Beklenen: bot reddedildi
        console.log(`Bot #${i} blocked: ${bots[i].address}`);
      }
    }, i * interval);
  }
}

// Kullanim
runBotSimulation({
  saleId: 0,
  botCount: 200,
  requestsPerSecond: 50,
  duration: 30,
});
```

---

## 7. Demo Senaryosu (Hackathon Gunu)

### 6.1 Demo Akisi

```
+-----------------------------------------------------------+
|                    BLITZ-GUARD DEMO                        |
+-----------------------------------------------------------+
|                                                           |
|  ADIM 1: Kullanici Giris                                  |
|  +---------------------------------------------+         |
|  |  [Connect Wallet]  [Verify with GitHub]     |         |
|  |                                              |         |
|  |  Status: "Verifying you're human..."        |         |
|  |  AI Analysis: "GitHub: 47 repos, 2 yrs      |         |
|  |  active -> Human Score: 95/100"              |         |
|  |  Result: "Human-Verified on Monad"           |         |
|  +---------------------------------------------+         |
|                                                           |
|  ADIM 2: Satis Bekleme                                    |
|  +---------------------------------------------+         |
|  |  NIKE AIR MAX LIMITED                        |         |
|  |  Stock: 100 pairs                            |         |
|  |  Sale starts in: 00:00:15                    |         |
|  |                                              |         |
|  |  [>> ACTIVATE MY AGENT <<]                   |         |
|  |                                              |         |
|  |  Agent Status: "Armed & Ready"               |         |
|  +---------------------------------------------+         |
|                                                           |
|  ADIM 3: Satis Ani (Kaos!)                                |
|  +---------------------------------------------+         |
|  |  SALE IS LIVE!                               |         |
|  |                                              |         |
|  |  Incoming requests: 5,847                    |         |
|  |  Bot requests blocked: 4,203                 |         |
|  |  Human requests processed: 1,644             |         |
|  |  Monad TPS: 8,421                            |         |
|  |                                              |         |
|  |  Your Agent: "Processing... #247 in queue"   |         |
|  |  Result: "PURCHASE SUCCESSFUL!"              |         |
|  +---------------------------------------------+         |
|                                                           |
|  ADIM 4: Sonuc                                            |
|  +---------------------------------------------+         |
|  |  CONGRATULATIONS!                            |         |
|  |                                              |         |
|  |  You got: Nike Air Max Limited               |         |
|  |  Position: #247 of 100 -> GOT IT!            |         |
|  |  Blocked bots: 4,203                         |         |
|  |  Fair queue position saved you!              |         |
|  |                                              |         |
|  |  [View TX on Monad Explorer]                 |         |
|  +---------------------------------------------+         |
+-----------------------------------------------------------+
```

### 6.2 Demo Icin Gerekli Minimum Bilesenler

| Bilesen | Aciklama | Tahmini Karmasiklik |
|---------|----------|---------------------|
| Frontend UI | Countdown + Agent butonu + sonuc ekrani | Orta |
| Mock AI Agent | Profil analiz eden basit bir servis | Dusuk |
| Smart Contract | Satis + dogrulama + siralama | Orta |
| Bot Simulatoru | Demo sirasinda bot trafigi simule eden script | Dusuk |
| Monad Testnet Deploy | Kontrat deploy + test | Dusuk |

---

## 8. Degerlenirme Kriterleri Uyumu

Monad Blitz'de projeler **izleyici oylamasi** ile seciliyor. Blitz-Guard'in guclu yanlari:

| Kriter | Blitz-Guard'in Avantaji |
|--------|------------------------|
| **Gercek Sorun** | Herkes "sold out" yasamisdir - aninda empati kurulan bir problem |
| **Monad Kullanimi** | Paralel execution + yuksek TPS = Monad'in core degerini gosteriyor |
| **Consumer App** | Hackathon temasi "Consumer Applications" - direkt uyumlu |
| **Demo Etkisi** | Canli bot vs insan yarisi = gorsel ve heyecanli demo |
| **Tatmin Duygusu** | "Botlari tokatlayan sistem" = izleyiciden dogal alkis |
| **Teknik Derinlik** | AI + Blockchain + Fair Sequencing = etkileyici stack |

---

## 9. Risk Analizi

| Risk | Etki | Olasilik | Azaltma Stratejisi |
|------|------|----------|---------------------|
| Monad Testnet erisim sorunu | Yuksek | Dusuk | Yerel mock chain hazirla |
| AI agent entegrasyonu zaman alabilir | Orta | Orta | Basit rule-based dogrulama yedek plan |
| Smart contract bug'lari | Yuksek | Orta | Basit tutulacak, sadece core logic |
| Demo sirasinda teknik aksama | Yuksek | Dusuk | Pre-recorded yedek demo hazirla |
| Zaman yetersizligi (1 gun) | Yuksek | Orta | MVP scope'u minimumda tut |

---

## 10. MVP Kapsam (1 Gunluk Hackathon)

### Yapilacaklar (Must Have)

- [x] Wallet baglantisi (MetaMask)
- [x] Basit insan dogrulama (GitHub API ile)
- [x] BlitzGuard smart contract (Monad Testnet)
- [x] "Sale Countdown" UI
- [x] "Activate Agent" butonu
- [x] Bot vs Human sonuc ekrani
- [x] Canli demo senaryosu

### Gelecekte Yapilabilir (Nice to Have)

- [ ] Gercek e-ticaret entegrasyonu
- [ ] Coklu sosyal medya dogrulama
- [ ] On-chain reputation sistemi
- [ ] Mobile app
- [ ] Satici dashboard'u
- [ ] Gercek odeme entegrasyonu

---

## 11. Takim Gorev Dagilimi (4 Kisi)

| Rol | Sorumluluk | Odak Alani |
|-----|-----------|------------|
| **Blockchain Dev** | Smart contract yazimi, Monad Testnet deploy, test | Solidity + Monad |
| **Frontend Dev** | UI/UX, wallet entegrasyonu, agent arayuzu, demo ekrani | React/Next.js |
| **AI/Agent Dev** | AI agent, bot detection logic, insan dogrulama servisi | Python / LangChain |
| **Backend Dev & Integrator** | API gateway, bot simulatoru, tum bilesenlerin entegrasyonu, demo hazirligi | Node.js / Express |

---

## 12. Zaman Cizelgesi (1 Gun)

| Saat | Aktivite |
|------|----------|
| 09:00 - 10:00 | Workshop'lara katilim, Monad ogrenimi |
| 10:00 - 10:30 | Takim sync, gorev dagilimi, repo setup |
| 10:30 - 12:00 | Paralel gelistirme baslar (contract + frontend + agent) |
| 12:00 - 12:30 | Ogle arasi + hizli sync |
| 12:30 - 15:00 | Core gelistirme devam - entegrasyon baslangici |
| 15:00 - 16:00 | Entegrasyon + Testnet deploy + bug fix |
| 16:00 - 17:00 | Demo hazirligi + prova |
| 17:00+ | Sunum ve demo |

---

## 13. Pitch / Sunum Onerileri

### Acilis Cumlesi (Hook)

> "Gecen yil 12 milyon kisi bir sneaker drop'unda 'Sold Out' gordu.
> Bunlarin %78'i ilk 0.3 saniyede botlara kaybetti.
> Biz Blitz-Guard'i yaptik - cunku artik botlar degil, insanlar kazanmali."

### Demo Sirasi

1. **Problem goster** (5 sn) - Bot vs insan animasyonu
2. **Cozumu anlat** (15 sn) - Monad + AI Agent + Fair Queue
3. **Canli demo** (60 sn) - Geri sayim > Agent aktive > Satis > Sonuc
4. **Monad vurgusu** (10 sn) - "10,000 TPS olmasa bu mumkun olmazdi"
5. **Kapnis** (5 sn) - "Botlar degil, insanlar kazanmali."

---

*Bu dokuman Monad Blitz Hackathon'u icin hazirlanmistir.*
*Blitz-Guard - Botlari Durdur, Insanlari Koru.*
