# Chapter 6: เทคโนโลยีไร้สายสำหรับ IoT
## Wireless Technologies for IoT

---

**วัตถุประสงค์การเรียนรู้ (Learning Objectives)**

1. อธิบายหลักการพื้นฐานของการสื่อสารไร้สาย ได้แก่ คลื่นความถี่ แบนด์วิดท์ ย่าน ISM และกลไกการลดทอนสัญญาณทางคณิตศาสตร์
2. เข้าใจและอธิบายรายละเอียดทางเทคนิคของเทคโนโลยี Wi-Fi, Bluetooth/BLE, Zigbee, LoRa/LoRaWAN และ Cellular IoT (NB-IoT/LTE-M/5G)
3. วิเคราะห์สถาปัตยกรรมการทำงานระดับโปรโตคอล เช่น โครงสร้าง GATT ของ BLE, โครงข่าย Mesh ของ Zigbee, การมอดูเลตแบบ CSS ของ LoRa และกระบวนการเชื่อมต่อ Wi-Fi (Handshake)
4. ประยุกต์ใช้ความรู้ด้านเทคโนโลยีไร้สายเพื่อออกแบบสถาปัตยกรรมระบบ IoT สำหรับงานทางวิศวกรรมเครื่องกลและอุตสาหกรรม (Mechanical and Industrial Engineering Case Studies)
5. พัฒนาและดีบักโค้ด Arduino C++ สำหรับบอร์ด ESP32 เพื่อเชื่อมต่อ Wi-Fi (DHCP/Static IP, Non-blocking Reconnection) และสร้าง BLE GATT Server ได้อย่างถูกต้องตามแนวปฏิบัติที่ดีที่สุด

---

## 6.1 พื้นฐานการสื่อสารไร้สาย (Wireless Communication Fundamentals)

การสื่อสารไร้สาย (Wireless Communication) คือกระบวนการส่งและรับข้อมูลระหว่างอุปกรณ์โดยอาศัยคลื่นแม่เหล็กไฟฟ้า (Electromagnetic Waves) ซึ่งจะแพร่กระจายผ่านตัวกลางที่เป็นอากาศหรืออวกาศ แทนการใช้สายสัญญาณทางกายภาพ (เช่น สายทองแดง หรือสายไฟเบอร์ออปติก) การสื่อสารไร้สายคือหัวใจสำคัญในการปลดล็อกระบบ IoT เนื่องจากอุปกรณ์เซ็นเซอร์ในโรงงานอุตสาหกรรมหรือพื้นที่เกษตรกรรมมักติดตั้งอยู่ในจุดที่เคลื่อนไหว เข้าถึงยาก หรือมีค่าใช้จ่ายสูงหากต้องเดินสายสัญญาณ

### 6.1.1 คลื่นความถี่และย่าน ISM (RF & ISM Bands)

คลื่นวิทยุ (Radio Frequency — RF) เป็นส่วนหนึ่งของสเปกตรัมแม่เหล็กไฟฟ้า (Electromagnetic Spectrum) ที่อยู่ระหว่างความถี่ 3 kHz ถึง 300 GHz อุปกรณ์วิทยุทั่วไปจำเป็นต้องได้รับการควบคุมการใช้งานความถี่โดยหน่วยงานของรัฐ (เช่น กสทช. ในประเทศไทย) เพื่อป้องกันไม่ให้สัญญาณรบกวนกัน

อย่างไรก็ตาม เพื่อส่งเสริมการพัฒนาเทคโนโลยีและการใช้งานเชิงสาธารณะ จึงมีการกำหนดระดับสากลให้มี **ย่านความถี่ ISM (Industrial, Scientific, and Medical Band)** ซึ่งเป็นย่านความถี่ที่ไม่ต้องขอใบอนุญาต (Unlicensed Band) อนุญาตให้ทุกคนสามารถพัฒนาและใช้อุปกรณ์ส่งสัญญาณวิทยุในย่านนี้ได้ภายใต้ข้อกำหนดเรื่องกำลังส่งสูงสุด (Transmit Power Limit) ย่านความถี่ ISM ที่สำคัญในงาน IoT ได้แก่:

*   **ย่าน Sub-GHz (ความถี่ต่ำกว่า 1 GHz):**
    *   **433 MHz:** นิยมใช้ในรีโมตคอนโทรลรถยนต์ ระบบเปิด-ปิดประตูอัตโนมัติ และระบบสื่อสารระยะสั้น
    *   **868 MHz (ยุโรป) / 915 MHz (อเมริกา) / 920-925 MHz (ประเทศไทย - อ้างอิงตามมาตรฐาน กสทช. มท. 1031-2562):** เป็นย่านหลักสำหรับเทคโนโลยีระยะไกลพลังงานต่ำ เช่น LoRa และ Zigbee บางประเภท
    *   *ลักษณะเด่น:* ความยาวคลื่น (Wavelength) มีขนาดใหญ่ ทำให้สามารถสะท้อน เลี้ยวเบน (Diffraction) และทะลุผ่านสิ่งกีดขวาง เช่น ผนังคอนกรีต ต้นไม้ หรือโครงสร้างเหล็กได้ดีมาก มีระยะทางส่งไกลกว่าย่านความถี่สูงที่กำลังส่งเท่ากัน แต่แบนด์วิดท์ต่ำกว่า
*   **ย่าน 2.4 GHz (ความถี่ 2.400 GHz ถึง 2.4835 GHz):**
    *   เป็นย่านที่ใช้งานทั่วโลก (Global License-free) ใช้สำหรับ Wi-Fi (802.11b/g/n), Bluetooth/BLE และ Zigbee
    *   *ลักษณะเด่น:* มีแบนด์วิดท์ที่กว้างกว่า ส่งข้อมูลได้เร็วกว่าย่าน Sub-GHz แต่ความยาวคลื่นมีขนาดสั้น (~12.5 cm) ทำให้ถูกดูดซับโดยสิ่งกีดขวางได้ง่าย โดยเฉพาะน้ำและความชื้น (เนื่องจากโมเลกุลของน้ำมี resonance frequency ในย่านความถี่นี้พอดี) อีกทั้งยังมีปัญหาการรบกวนของสัญญาณที่แออัดเนื่องจากมีอุปกรณ์ใช้งานหนาแน่น
*   **ย่าน 5 GHz และ 6 GHz:**
    *   ใช้สำหรับ Wi-Fi ความเร็วสูง (Wi-Fi 5/6/7) มีช่องสัญญาณกว้างและไม่มีสัญญาณรบกวนจากอุปกรณ์บลูทูธ แต่ระยะทางส่งสั้นลงมากและมีความสามารถในการทะลุทะลวงผนังต่ำ

### 6.1.2 แบนด์วิดท์ (Bandwidth)

แบนด์วิดท์คือ **ความกว้างของช่วงความถี่ (Frequency Range)** ที่ใช้ในการรับส่งสัญญาณวิทยุ มีหน่วยวัดเป็นเฮิรตซ์ (Hz) เช่น ช่องสัญญาณ LoRa กว้าง 125 kHz ช่องสัญญาณ Wi-Fi กว้าง 20 MHz หรือ 40 MHz
ตามหลักการทางทฤษฎีสารสนเทศ (Shannon-Hartley Theorem):
$$C = B \log_2 \left(1 + \frac{S}{N}\right)$$
โดยที่ $C$ คือความจุช่องสัญญาณ (Channel Capacity - bps), $B$ คือแบนด์วิดท์ (Bandwidth - Hz) และ $S/N$ คืออัตราส่วนสัญญาณต่อสัญญาณรบกวน (Signal-to-Noise Ratio)
ดังนั้น ยิ่งแบนด์วิดท์กว้างขึ้น อัตราการรับส่งข้อมูล (Data Rate) สูงสุดก็จะยิ่งมากขึ้น แต่การใช้แบนด์วิดท์ที่กว้างจะทำให้อุปกรณ์รับสัญญาณรบกวน (Noise) เข้ามามากขึ้นเช่นกัน และจำเป็นต้องประมวลผลสัญญาณที่ซับซ้อนขึ้น ส่งผลให้กินพลังงานเพิ่มขึ้น

### 6.1.3 การลดทอนสัญญาณ (Signal Attenuation)

เมื่อคลื่นวิทยุเดินทางออกจากสายอากาศส่ง กำลังของสัญญาณจะลดทอนลงตามระยะทางและสิ่งแวดล้อม ปรากฏการณ์นี้อธิบายได้ด้วยทฤษฎีทางฟิสิกส์และคณิตศาสตร์ดังนี้:

#### 1. กฎกำลังสองผกผัน (Inverse Square Law)
ในสภาวะที่ไม่มีสิ่งกีดขวางและไม่มีการดูดซับของชั้นบรรยากาศ (Free Space) พลังงานคลื่นแม่เหล็กไฟฟ้าจะกระจายออกเป็นทรงกลมรอบสายอากาศแบบรอบตัว (Isotropic Antenna) ความเข้มของพลังงานต่อพื้นที่ผิวจะลดลงเป็นสัดส่วนผกผันกับระยะทางยกกำลังสอง:
$$P_r \propto \frac{P_t}{d^2}$$
โดยที่ $P_r$ คือกำลังสัญญาณที่ฝั่งรับ, $P_t$ คือกำลังสัญญาณที่ฝั่งส่ง และ $d$ คือระยะห่างระหว่างจุดส่งและจุดรับ

#### 2. แบบจำลองความสูญเสียในเส้นทางฟรีสเปซ (Free Space Path Loss — FSPL)
ความสูญเสียในเส้นทางฟรีสเปซ (FSPL) คือค่าการลดทอนของกำลังสัญญาณเมื่อคลื่นเดินทางผ่านพื้นที่ว่างโดยไม่มีสิ่งกีดขวาง คำนวณได้ดังนี้:
$$\text{FSPL} = \left(\frac{4\pi d}{\lambda}\right)^2 = \left(\frac{4\pi d f}{c}\right)^2$$
เมื่อแปลงให้อยู่ในรูปของสเกลลอการิทึม (เดซิเบล - dB) จะได้สูตรการคำนวณความสูญเสียดังนี้:
$$\text{FSPL (dB)} = 20\log_{10}(d) + 20\log_{10}(f) + 20\log_{10}\left(\frac{4\pi}{c}\right)$$
หากต้องการคำนวณกำลังสัญญาณที่ฝั่งรับ ($P_r$) โดยรวมผลของกำลังส่ง ($P_t$) และกำลังขยายของสายอากาศส่งและรับ ($G_t, G_r$ ในหน่วย dBi) จะใช้ **สมการส่งผ่านของฟรีส (Friis Transmission Equation)** ดังนี้:
$$P_r\text{ (dBm)} = P_t\text{ (dBm)} + G_t\text{ (dBi)} + G_r\text{ (dBi)} - \text{FSPL (dB)}$$

หากสมมติให้กำลังขยายของสายอากาศส่งและรับ ($G_t, G_r$) เท่ากับ $0\text{ dBi}$ และแทนค่าความเร็วแสง $c \approx 3 \times 10^8\text{ m/s}$ จะได้สูตรแบบง่ายเมื่อระยะทาง $d$ เป็นเมตร (m) และความถี่ $f$ เป็นเฮิรตซ์ (Hz):
$$\text{FSPL (dB)} = 20\log_{10}(d) + 20\log_{10}(f) - 147.56$$
และหากแปลงหน่วยระยะทางเป็นกิโลเมตร ($d_{\text{km}}$) และความถี่เป็นเมกะเฮิรตซ์ ($f_{\text{MHz}}$) จะได้สูตรมาตรฐานที่ใช้ในงานวิศวกรรมวิทยุ:
$$\text{FSPL (dB)} = 20\log_{10}(d_{\text{km}}) + 20\log_{10}(f_{\text{MHz}}) + 32.44$$
*การวิเคราะห์จากสมการ:* หากความถี่สูงขึ้น ($f$ เพิ่มขึ้น) ความสูญเสียในสเปซจะเพิ่มขึ้นตามลอการิทึม นี่เป็นเหตุผลว่าทำไมย่าน Sub-GHz (เช่น 923 MHz) จึงมีค่าการลดทอนที่ต่ำกว่าและเดินทางได้ไกลกว่าย่าน 2.4 GHz มากที่ระดับกำลังส่งเท่ากัน

#### 3. ค่า RSSI (Received Signal Strength Indicator)
RSSI คือระดับกำลังสัญญาณที่เครื่องรับสแกนและวัดได้ มีหน่วยเป็น **dBm (Decibels relative to 1 milliwatt)** เป็นค่าลอการิทึมที่เทียบกำลังไฟกับ 1 มิลลิวัตต์:
$$\text{Power (dBm)} = 10\log_{10}\left(\frac{P_{\text{mW}}}{1\text{ mW}}\right)$$
*   $0\text{ dBm} = 1\text{ mW}$
*   $-30\text{ dBm} = 1\text{ }\mu\text{W}$ (ระดับสัญญาณดีเยี่ยม มักอยู่ใกล้เครื่องส่งมาก)
*   $-70\text{ dBm} = 0.1\text{ nW}$ (ระดับสัญญาณปานกลาง ใช้งานทั่วไปได้เสถียร)
*   $-90\text{ dBm}$ ถึง $-100\text{ dBm}$ (ระดับสัญญาณอ่อนมาก มีโอกาสที่ข้อมูลจะสูญหายสูง หรือเชื่อมต่อหลุด)
*   $-120\text{ dBm}$ ขึ้นไป (สัญญาณต่ำมากจนใกล้เคียงระดับ Noise Floor วิทยุทั่วไปไม่สามารถถอดรหัสได้ ยกเว้น LoRa ที่มีกลไกพิเศษ)

#### 4. SNR (Signal-to-Noise Ratio)
SNR คืออัตราส่วนระหว่างกำลังของสัญญาณที่ต้องการรับเทียบกับกำลังของสัญญาณรบกวน (Noise floor) มีหน่วยเป็นเดซิเบล (dB):
$$\text{SNR (dB)} = P_{\text{signal (dBm)}} - P_{\text{noise (dBm)}}$$
*   **ค่า SNR เป็นบวก (เช่น +10 dB):** สัญญาณมีความแรงกว่าสัญญาณรบกวน ถอดรหัสข้อมูลได้ง่าย
*   **ค่า SNR เป็นศูนย์หรือติดลบ (เช่น -5 dB):** สัญญาณมีความแรงเท่ากันหรือน้อยกว่าสัญญาณรบกวน ในวิทยุทั่วไป (เช่น Wi-Fi) จะไม่สามารถใช้งานได้ แต่ LoRa สามารถถอดรหัสสัญญาณที่ติดลบได้ถึง -20 dB เนื่องจากประสิทธิภาพของการมอดูเลตแบบ CSS

---

## 6.2 Wi-Fi

Wi-Fi คือเทคโนโลยีเครือข่ายไร้สายระยะใกล้ถึงปานกลางที่ได้รับความนิยมสูงที่สุด ออกแบบมาตามมาตรฐานของสมาคม IEEE ในรหัสกลุ่ม **802.11** โดยเน้นการให้บริการรับส่งข้อมูลความเร็วสูงและเชื่อมโยงเข้ากับเครือข่ายอินเทอร์เน็ตผ่านโครงสร้างพื้นฐานที่มีอยู่เดิม (Access Point และ Router)

### 6.2.1 รายละเอียดมาตรฐาน IEEE 802.11 แต่ละยุค

ความต้องการใช้งานในระบบ IoT แตกต่างจากคอมพิวเตอร์ทั่วไป บางงานต้องการอัตราข้อมูลที่สูงมาก (เช่น กล้องวงจรปิด IP) แต่บางงานต้องการระยะทางไกลและการประหยัดพลังงาน มาตรฐานวิทยุ 802.11 จึงได้รับการปรับปรุงและพัฒนาออกมาหลายรุ่นย่อย ดังแสดงในตารางเปรียบเทียบ:

| มาตรฐาน | ชื่อยุค (Generational Name) | ช่วงความถี่หลัก (Frequency) | ความกว้างช่องสัญญาณ (Channel Width) | อัตราส่งข้อมูลสูงสุด (Max Data Rate) | ระยะทางใช้งานทั่วไป (Typical Range) | จุดประสงค์และลักษณะการใช้งานในระบบ IoT |
|---|---|---|---|---|---|---|
| **802.11b** | Wi-Fi 1 | 2.4 GHz | 22 MHz | 11 Mbps | ~35 m (ในอาคาร) | ยุคบุกเบิก ใช้การมอดูเลตแบบ DSSS ทนทานต่อการรบกวนระดับหนึ่ง แต่ความเร็วต่ำมาก ปัจจุบันยังพบในระบบ legacy |
| **802.11g** | Wi-Fi 3 | 2.4 GHz | 20 MHz | 54 Mbps | ~38 m (ในอาคาร) | เปลี่ยนมาใช้การมอดูเลตแบบ OFDM อัตราข้อมูลสูงขึ้น เข้ากันได้กับอุปกรณ์ 802.11b ยึดเป็นมาตรฐานวิทยุพื้นฐาน |
| **802.11n** | Wi-Fi 4 | 2.4 GHz / 5 GHz | 20 MHz, 40 MHz | 72 - 600 Mbps | ~70 m (ในอาคาร) | **รองรับโดยชิป ESP32** เพิ่มเทคโนโลยี MIMO (Multi-Input Multi-Output) ใช้สายอากาศหลายต้น ส่งสัญญาณครอบคลุมและมีประสิทธิภาพสูงสุดในย่าน 2.4 GHz |
| **802.11ac** | Wi-Fi 5 | 5 GHz | 20, 40, 80, 160 MHz | 433 Mbps - 6.93 Gbps | ~35 m (ในอาคาร) | เน้นส่งข้อมูลเร็วสูงมากเฉพาะในย่าน 5 GHz ลดสัญญาณรบกวนจากอุปกรณ์อื่น แต่ระยะทางสั้นลงและทะลุผนังปูนได้แย่ |
| **802.11ax** | Wi-Fi 6 / 6E | 2.4 GHz / 5 GHz / 6 GHz | 20 - 160 MHz | Up to 9.6 Gbps | ~30 m (ในอาคาร) | ใช้เทคโนโลยี OFDMA และ 1024-QAM จัดการช่องสัญญาณที่มีอุปกรณ์หนาแน่นได้ดีขึ้น เหมาะกับโรงงานอัจฉริยะที่มีจุดเซ็นเซอร์ Wi-Fi เป็นร้อยจุด |
| **802.11ah** | Wi-Fi HaLow | Sub-1 GHz (920-925 MHz ในไทย) | 1, 2, 4, 8, 16 MHz | 150 kbps - 8.7 Mbps | **~1 km** | **พัฒนาเพื่อ IoT โดยเฉพาะ** ทำงานที่ย่านความถี่ต่ำ ประหยัดพลังงานมาก รองรับโหมด Sleep ระยะไกลมาก เหมาะกับงานเกษตรกรรมและโรงงานขนาดใหญ่ |

### 6.2.2 สถาปัตยกรรมการทำงานของ Wi-Fi ใน ESP32

ไมโครคอนโทรลเลอร์ ESP32 มีชิปวิทยุ Wi-Fi 802.11b/g/n ในตัว รองรับโหมดการทำงาน 3 รูปแบบหลัก ซึ่งนักพัฒนาสามารถประยุกต์ใช้งานได้ตามความเหมาะสม:

1.  **Station Mode (STA):** ESP32 ทำงานเป็นอุปกรณ์ลูกข่าย (Client) เชื่อมต่อเข้ากับ Access Point (AP) หรือเราเตอร์ในบ้านหรือโรงงานเพื่อเข้าสู่เครือข่าย LAN/Internet โหมดนี้เหมาะสำหรับส่งข้อมูลขึ้น Cloud
2.  **Access Point Mode (AP):** ESP32 ทำหน้าที่เป็นจุดกระจายสัญญาณ สร้างเครือข่าย Wi-Fi ท้องถิ่นของตัวเองและจ่าย IP Address ให้อุปกรณ์อื่น (เช่น โน้ตบุ๊ก หรือ สมาร์ตโฟน) เชื่อมต่อเข้ามา โหมดนี้มักนิยมใช้ในการกำหนดค่าเริ่มต้นให้บอร์ด (Configuration Mode) เช่น ผู้ใช้ต่อ Wi-Fi ของบอร์ดเพื่อกรอกรหัสผ่าน Wi-Fi บ้านผ่านหน้าเว็บเบราว์เซอร์
3.  **AP+STA Dual Mode:** ESP32 ทำงานทั้งสองโหมดพร้อมกัน ช่วยให้บอร์ดสามารถเชื่อมต่อเครือข่ายภายนอกเพื่อทำงานหลักได้ ในขณะเดียวกันก็ยังเปิดช่องทางให้ช่างเทคนิคเชื่อมต่อไร้สายเข้ามาตรวจสอบหรือตั้งค่าการทำงาน (Diagnostic Interface) ได้โดยตรง

### 6.2.3 ขั้นตอนการเชื่อมต่อเครือข่าย Wi-Fi (Wi-Fi Connection Process)

ก่อนที่อุปกรณ์ Wi-Fi Client (เช่น ESP32) จะสามารถส่งข้อมูลผ่านเครือข่ายได้ จะต้องผ่านกระบวนการเชื่อมต่อ (Link Layer Connection) 4 ขั้นตอนดังนี้:

<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 760 480" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <title>Wi-Fi Handshake Connection Process</title>
  <style>
    .bg { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1.5; rx: 12px; }
    .mcu-box { fill: #faf5ff; stroke: #7c3aed; stroke-width: 2; rx: 8px; }
    .comp-box { fill: #ffffff; stroke: #334155; stroke-width: 2; rx: 4px; }
    
    .node-title { font-size: 14px; font-weight: 700; fill: #7c3aed; text-anchor: middle; }
    .node-subtitle { font-size: 12px; fill: #334155; text-anchor: middle; }
    .lifeline { stroke: #334155; stroke-width: 2.5; stroke-dasharray: 6 4; }
    
    .arrow-line { stroke: #334155; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
    .arrow-head { fill: #334155; }
    
    .packet-req { fill: none; stroke: #f59e0b; stroke-width: 4; stroke-linecap: round; stroke-dasharray: 10 12; animation: marchRight 2.5s linear infinite; }
    .packet-resp { fill: none; stroke: #16a34a; stroke-width: 4; stroke-linecap: round; stroke-dasharray: 10 12; animation: marchLeft 2.5s linear infinite; }
    .packet-both { fill: none; stroke: #16a34a; stroke-width: 4; stroke-linecap: round; stroke-dasharray: 10 12; animation: marchRight 2s linear infinite; }

    @keyframes marchRight {
      to { stroke-dashoffset: -44; }
    }
    @keyframes marchLeft {
      to { stroke-dashoffset: 44; }
    }

    .msg-text { font-size: 11.5px; fill: #334155; font-weight: 600; }
    .msg-num { font-size: 11px; fill: #334155; font-weight: bold; }
    .num-circle { fill: #ffffff; stroke: #334155; stroke-width: 1.5; }
    
    .phase-text { font-size: 11px; fill: #334155; font-weight: bold; }
  </style>

  <!-- Background -->
  <rect x="5" y="5" width="750" height="470" class="bg"/>

  <!-- Phase labels on left -->
  <rect x="25" y="115" width="95" height="75" class="comp-box" />
  <text x="72" y="145" class="phase-text" text-anchor="middle">1. สแกนสัญญาณ</text>
  <text x="72" y="162" class="phase-text" text-anchor="middle">(Scanning)</text>

  <rect x="25" y="205" width="95" height="50" class="comp-box" />
  <text x="72" y="230" class="phase-text" text-anchor="middle">2. พิสูจน์สิทธิ์</text>
  <text x="72" y="245" class="phase-text" text-anchor="middle">(Auth)</text>

  <rect x="25" y="270" width="95" height="50" class="comp-box" />
  <text x="72" y="295" class="phase-text" text-anchor="middle">3. เชื่อมโยง</text>
  <text x="72" y="310" class="phase-text" text-anchor="middle">(Association)</text>

  <rect x="25" y="335" width="95" height="75" class="comp-box" />
  <text x="72" y="365" class="phase-text" text-anchor="middle">4. เข้ารหัสลับ</text>
  <text x="72" y="382" class="phase-text" text-anchor="middle">(4-Way)</text>

  <!-- Lifelines -->
  <line x1="200" y1="100" x2="200" y2="430" class="lifeline"/>
  <line x1="560" y1="100" x2="560" y2="430" class="lifeline"/>

  <!-- Client Node Header -->
  <rect x="130" y="30" width="140" height="60" class="mcu-box"/>
  <text x="200" y="55" class="node-title">ลูกข่าย Wi-Fi</text>
  <text x="200" y="75" class="node-subtitle">(ESP32 Station)</text>

  <!-- AP Node Header -->
  <rect x="490" y="30" width="140" height="60" class="mcu-box"/>
  <text x="560" y="55" class="node-title">จุดเข้าใช้งาน</text>
  <text x="560" y="75" class="node-subtitle">(Access Point - AP)</text>

  <!-- Step 1: Probe Request (Client -> AP) -->
  <g>
    <line x1="200" y1="130" x2="550" y2="130" class="arrow-line" />
    <polygon points="550,126 560,130 550,134" class="arrow-head" />
    <path d="M 200 130 L 560 130" class="packet-req" />
    <circle cx="165" cy="130" r="10" class="num-circle" />
    <text x="165" y="134" class="msg-num" text-anchor="middle">1</text>
    <text x="380" y="120" class="msg-text" text-anchor="middle">Probe Request (ค้นหาสัญญาณ)</text>
  </g>

  <!-- Step 2: Probe Response (AP -> Client) -->
  <g>
    <line x1="560" y1="170" x2="210" y2="170" class="arrow-line" />
    <polygon points="210,166 200,170 210,174" class="arrow-head" />
    <path d="M 560 170 L 200 170" class="packet-resp" />
    <circle cx="595" cy="170" r="10" class="num-circle" />
    <text x="595" y="174" class="msg-num" text-anchor="middle">2</text>
    <text x="380" y="160" class="msg-text" text-anchor="middle">Probe Response (ตอบกลับความพร้อม)</text>
  </g>

  <!-- Step 3: Authentication Request (Client -> AP) -->
  <g>
    <line x1="200" y1="220" x2="550" y2="220" class="arrow-line" />
    <polygon points="550,216 560,220 550,224" class="arrow-head" />
    <path d="M 200 220 L 560 220" class="packet-req" />
    <circle cx="165" cy="220" r="10" class="num-circle" />
    <text x="165" y="224" class="msg-num" text-anchor="middle">3</text>
    <text x="380" y="210" class="msg-text" text-anchor="middle">Authentication Request (ส่งคำขอพิสูจน์สิทธิ์)</text>
  </g>

  <!-- Step 4: Authentication Response (AP -> Client) -->
  <g>
    <line x1="560" y1="250" x2="210" y2="250" class="arrow-line" />
    <polygon points="210,246 200,250 210,254" class="arrow-head" />
    <path d="M 560 250 L 200 250" class="packet-resp" />
    <circle cx="595" cy="250" r="10" class="num-circle" />
    <text x="595" y="254" class="msg-num" text-anchor="middle">4</text>
    <text x="380" y="240" class="msg-text" text-anchor="middle">Authentication Response (ยืนยันสิทธิ์เบื้องต้น)</text>
  </g>

  <!-- Step 5: Association Request (Client -> AP) -->
  <g>
    <line x1="200" y1="285" x2="550" y2="285" class="arrow-line" />
    <polygon points="550,281 560,285 550,289" class="arrow-head" />
    <path d="M 200 285 L 560 285" class="packet-req" />
    <circle cx="165" cy="285" r="10" class="num-circle" />
    <text x="165" y="289" class="msg-num" text-anchor="middle">5</text>
    <text x="380" y="275" class="msg-text" text-anchor="middle">Association Request (ขอเชื่อมต่อลิงก์ข้อมูล)</text>
  </g>

  <!-- Step 6: Association Response (AP -> Client) -->
  <g>
    <line x1="560" y1="315" x2="210" y2="315" class="arrow-line" />
    <polygon points="210,311 200,315 210,319" class="arrow-head" />
    <path d="M 560 315 L 200 315" class="packet-resp" />
    <circle cx="595" cy="315" r="10" class="num-circle" />
    <text x="595" y="319" class="msg-num" text-anchor="middle">6</text>
    <text x="380" y="305" class="msg-text" text-anchor="middle">Association Response (ตอบกลับการยอมรับลิงก์)</text>
  </g>

  <!-- Step 7: 4-Way WPA Handshake (Exchanging Keys) -->
  <g>
    <rect x="180" y="340" width="400" height="85" class="comp-box" />
    <line x1="210" y1="365" x2="550" y2="365" class="arrow-line" />
    <polygon points="215,361 205,365 215,369" fill="#334155" />
    <polygon points="545,361 555,365 545,369" fill="#334155" />

    <line x1="210" y1="395" x2="550" y2="395" class="arrow-line" />
    <polygon points="215,391 205,395 215,399" fill="#334155" />
    <polygon points="545,391 555,395 545,399" fill="#334155" />
    
    <g transform="translate(370, 368)">
      <rect x="2" y="7" width="16" height="11" rx="2" fill="#334155"/>
      <path d="M 4 7 L 4 4 A 4 4 0 0 1 16 4 L 16 7" fill="none" stroke="#334155" stroke-width="2"/>
    </g>

    <path d="M 200 365 L 560 365" class="packet-both" />
    <path d="M 560 395 L 200 395" class="packet-both" style="animation-direction: reverse;" />

    <circle cx="165" cy="380" r="10" class="num-circle" />
    <text x="165" y="384" class="msg-num" text-anchor="middle">7</text>
    <text x="380" y="358" class="msg-text" text-anchor="middle">กระบวนการ 4-Way Handshake (WPA2/WPA3)</text>
    <text x="380" y="410" class="msg-text" text-anchor="middle" style="font-size: 10px;">(แลกเปลี่ยนคีย์ PTK เข้ารหัสข้อมูลโดยไม่ส่งรหัสผ่านจริง)</text>
  </g>
</svg>
</div>

1.  **Scanning (การค้นหาสัญญาณ):** Client ทำการกวาดช่องความถี่เพื่อค้นหา AP ที่กำลังทำงาน
    *   *Passive Scanning:* รอฟังสัญญาณ **Beacon Frame** ที่ AP ส่งออกมาเป็นรอบเวลาปกติ (ปกติทุก 100 ms)
    *   *Active Scanning:* Client ส่งเฟรม **Probe Request** ออกไปในทุกช่องความถี่ แล้วรอฟัง **Probe Response** ตอบกลับจาก AP ที่มี SSID ตรงกับที่ต้องการค้นหา
2.  **Authentication (การพิสูจน์สิทธิ์ระดับลิงก์):** เป็นขั้นตอนเริ่มต้นเพื่อสร้างความน่าเชื่อถือระดับวิทยุ ซึ่งส่วนใหญ่มักเป็นระบบ *Open System Authentication* (ยอมรับการเชื่อมต่อวิทยุกับอุปกรณ์ทุกตัวโดยยังไม่ได้ตรวจสอบรหัสผ่านจริง)
3.  **Association (การเชื่อมโยงสถานะ):** Client ส่งเฟรม **Association Request** เพื่อขอบันทึกสถานะการเชื่อมต่อกับ AP เมื่อ AP ตอบรับด้วย **Association Response** ทั้งคู่จะถือว่ามีการเชื่อมต่อทางกายภาพทางวิทยุสำเร็จ
4.  **4-Way Handshake (กระบวนการแลกเปลี่ยนกุญแจเข้ารหัสลับ):** ในกรณีที่เครือข่ายใช้การเข้ารหัสแบบความปลอดภัยสูง (เช่น WPA2 หรือ WPA3 Personal) จะเกิดการแลกเปลี่ยนข้อมูล 4 ขั้นตอนระหว่าง AP และ Client โดยไม่มีการส่งรหัสผ่านจริงผ่านอากาศ แต่ใช้รหัสผ่าน (PSK) ร่วมกับค่าสุ่ม (ANonce และ SNonce) เพื่อคำนวณและสร้างคีย์ชั่วคราว **PTK (Pairwise Transient Key)** เพื่อใช้เข้ารหัสข้อมูลในการสื่อสารหลังจากนั้น ป้องกันการดักจับข้อมูลและการโจมตีแบบ Replay Attack

### 6.2.4 การกำหนดค่า IP: DHCP vs Static IP

หลังจากเชื่อมโยงระดับลิงก์สำเร็จ อุปกรณ์จำเป็นต้องได้รับ IP Address ในระดับ Network Layer เพื่อให้สามารถจัดส่งแพ็กเกจข้อมูลในเครือข่าย TCP/IP ได้:

*   **DHCP (Dynamic Host Configuration Protocol):** เป็นค่าเริ่มต้นที่อุปกรณ์ใช้งานทั่วไป โดย ESP32 จะส่งคำขอแบบ Broadcast ไปในเครือข่ายเพื่อขอรับ IP Address, Subnet Mask, Gateway และ DNS Server จากอุปกรณ์เราเตอร์หรือ DHCP Server ขั้นตอนนี้มีข้อดีคือมีความยืดหยุ่นสูง ป้องกันปัญหา IP ซ้ำซ้อน (IP Conflict) แต่มีข้อจำกัดคือ IP ของ ESP32 อาจเปลี่ยนไปทุกครั้งที่บอร์ดรีบูตเครื่อง
*   **Static IP (ที่อยู่ IP คงที่):** เป็นการกำหนดค่าคงที่ลงในโค้ดของบอร์ดโดยตรง ข้อดีคือเราจะทราบ IP ของบอร์ดที่แน่นอนตลอดเวลา ทำให้เครื่องคอมพิวเตอร์หรือเซิร์ฟเวอร์ตัวอื่นสามารถวิ่งมาดึงข้อมูล (Pull Data) จาก ESP32 ได้อย่างถูกต้องโดยไม่ต้องสแกนหาตัวอุปกรณ์ในเครือข่าย เหมาะสำหรับการตั้งค่าบอร์ดเป็น Web Server หรือ TCP Server ในระบบควบคุมในโรงงาน

### 6.2.5 แนวคิดพอร์ต TCP (TCP Ports)

โปรโตคอล TCP (Transmission Control Protocol) ทำงานในชั้น Transport Layer ควบคุมการรับส่งข้อมูลแบบเน้นการเชื่อมต่อ (Connection-Oriented) โดยมีกลไกตรวจสอบความถูกต้องและการตอบรับข้อมูล (ACK)
ในการระบุว่าข้อมูลที่ได้รับจากเครือข่ายควรถูกส่งไปยังแอปพลิเคชันใดในระบบปฏิบัติการ จะมีการระบุหมายเลข **Port (พอร์ต)** ซึ่งเป็นค่าตัวเลขขนาด 16 บิต (มีค่าระหว่าง 1 ถึง 65535) พอร์ตที่สำคัญในงาน IoT ได้แก่:
*   **Port 80 (HTTP):** ใช้สำหรับการสื่อสารเว็บเพจทั่วไปแบบไม่เข้ารหัส
*   **Port 443 (HTTPS):** ใช้สำหรับเว็บเพจที่มีการเข้ารหัส SSL/TLS เพื่อความปลอดภัย
*   **Port 1883 (MQTT):** ใช้สำหรับการสื่อสารของโปรโตคอล MQTT แบบมาตรฐาน
*   **Port 8883 (MQTTS):** ใช้สำหรับ MQTT ที่เข้ารหัสความปลอดภัยด้วย SSL/TLS
*   **Port 502 (Modbus TCP):** ใช้สำหรับการรับส่งข้อมูลอุตสาหกรรมด้วยโปรโตคอล Modbus ผ่านเครือข่าย Ethernet หรือ Wi-Fi

---

### 6.2.6 ตัวอย่างโค้ด ESP32 Wi-Fi (Non-blocking & Static IP / DHCP Web Server)

ตัวอย่างโค้ดด้านล่างแสดงการออกแบบการเชื่อมต่อ Wi-Fi ที่ดีที่สุดสำหรับอุตสาหกรรม โดยใช้หลักการทำงานแบบ **Non-blocking** (การประมวลผลระบบโดยไม่ปล่อยให้ฟังก์ชันรอ Wi-Fi ไปบล็อกการทำงานหลัก เช่น การอ่านค่าเซ็นเซอร์อุณหภูมิมอเตอร์) และการตั้งค่า Static IP พร้อมฟังก์ชันป้องกันบอร์ดค้างจาก Client

```cpp
#include <WiFi.h>

// เปิด/ปิด การใช้ Static IP (คอมเมนต์ออกหากต้องการใช้ DHCP)
#define USE_STATIC_IP

// ข้อมูลเชื่อมต่อวิทยุ
const char* ssid     = "Factory_Wi-Fi_Network";
const char* password = "ControlRoomSecurePass";

#ifdef USE_STATIC_IP
// กำหนดที่อยู่ IP คงที่ที่ตรงกับวงเครือข่ายในโรงงาน
IPAddress local_IP(192, 168, 1, 200);
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);
IPAddress dns_primary(8, 8, 8, 8);
#endif

// สร้างอ็อบเจกต์ TCP Web Server บนพอร์ตมาตรฐาน 80
WiFiServer server(80);

// ตัวแปรควบคุมเวลาแบบไร้บล็อก (Non-blocking timing variables)
unsigned long lastAttemptTime = 0;
const unsigned long reconnectInterval = 10000; // พยายามเชื่อมใหม่ทุกๆ 10 วินาที
bool isCurrentlyConnected = false;

// พินควบคุมในเชิงวิศวกรรม (เช่น รีเลย์พัดลมระบายความร้อนมอเตอร์)
const int COOLING_FAN_RELAY = 14; 
bool fanState = false;

void setup() {
  Serial.begin(115200);
  pinMode(COOLING_FAN_RELAY, OUTPUT);
  digitalWrite(COOLING_FAN_RELAY, LOW);

  // สั่งปิดโหมด Modem Sleep ของ Wi-Fi ชั่วคราวเพื่อเสถียรภาพสูงสุดและการตอบสนองที่รวดเร็ว
  WiFi.setSleep(false);

  #ifdef USE_STATIC_IP
  if (!WiFi.config(local_IP, gateway, subnet, dns_primary)) {
    Serial.println("[Wi-Fi] ไม่สามารถกำหนดค่า Static IP ได้!");
  } else {
    Serial.println("[Wi-Fi] กำหนดค่า Static IP สำเร็จ");
  }
  #endif

  Serial.print("[Wi-Fi] กำลังเริ่มเชื่อมต่อกับ SSID: ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  lastAttemptTime = millis();
  
  server.begin();
}

void loop() {
  unsigned long currentMillis = millis();

  // 1. จัดการการเชื่อมต่อ Wi-Fi ใหม่หากสัญญาณหลุดหายแบบ Non-blocking
  if (WiFi.status() != WL_CONNECTED) {
    isCurrentlyConnected = false;
    
    // พยายามเริ่มระบบวิทยุใหม่ทุกๆ รอบเวลา
    if (currentMillis - lastAttemptTime >= reconnectInterval) {
      Serial.println("[Wi-Fi] การเชื่อมต่อหลุดหาย! พยายามเชื่อมใหม่...");
      WiFi.disconnect();
      WiFi.begin(ssid, password);
      lastAttemptTime = currentMillis;
    }
  } else {
    // พิมพ์ข้อมูลรายละเอียด IP เมื่อบอร์ดต่อเครือข่ายได้ครั้งแรก
    if (!isCurrentlyConnected) {
      Serial.println("\n----------------------------------------");
      Serial.println("[Wi-Fi] เชื่อมต่อสำเร็จ!");
      Serial.print("IP Address: "); Serial.println(WiFi.localIP());
      Serial.print("กำลังสัญญาณ (RSSI): "); Serial.print(WiFi.RSSI()); Serial.println(" dBm");
      Serial.println("----------------------------------------");
      isCurrentlyConnected = true;
    }
  }

  // 2. ตรวจสอบการร้องขอจากผู้ใช้หรือ SCADA (HTTP Client) เข้ามาที่ Web Server
  WiFiClient client = server.available();
  if (client) {
    Serial.println("[Server] มี Client ใหม่เชื่อมต่อเข้ามา");
    String currentRequestLine = "";
    unsigned long clientConnectedTime = millis();
    const unsigned long clientTimeoutLimit = 2500; // หลีกเลี่ยงปัญหาระบบหยุดรอข้อมูลจาก Client นานเกินไป

    // วนลูปอ่านข้อมูล HTTP Request ตราบเท่าที่เชื่อมอยู่และยังไม่หมดเวลา
    while (client.connected() && (millis() - clientConnectedTime < clientTimeoutLimit)) {
      if (client.available()) {
        char c = client.read();
        
        // หากได้รับขึ้นบรรทัดใหม่ '\n' และบรรทัดปัจจุบันมีความยาวเป็นศูนย์ แสดงว่าสิ้นสุด Header ของ HTTP
        if (c == '\n') {
          if (currentRequestLine.length() == 0) {
            
            // ส่ง HTTP Response Header
            client.println("HTTP/1.1 200 OK");
            client.println("Content-Type: text/html; charset=utf-8");
            client.println("Connection: close");
            client.println();
            
            // ส่งข้อมูลเว็บเพจอินเตอร์เฟสควบคุมในโรงงาน
            client.println("<!DOCTYPE html><html>");
            client.println("<head><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">");
            client.println("<style>body{font-family:Arial,sans-serif; text-align:center; margin-top:50px;}");
            client.println(".btn{padding:15px 30px; font-size:18px; color:white; border:none; cursor:pointer;}");
            client.println(".btn-on{background-color:#4CAF50;} .btn-off{background-color:#f44336;}</style></head>");
            client.println("<body><h2>ระบบควบคุมเครื่องจักรอุตสาหกรรมทางไกล</h2>");
            
            // แสดงสถานะพัดลมระบายอากาศ
            if (fanState) {
              client.println("<p>สถานะพัดลม: <strong style=\"color:green;\">เปิดทำงาน (ON)</strong></p>");
              client.println("<p><a href=\"/fan/off\"><button class=\"btn btn-off\">ปิดพัดลมระบายอากาศ</button></a></p>");
            } else {
              client.println("<p>สถานะพัดลม: <strong style=\"color:red;\">ปิดทำงาน (OFF)</strong></p>");
              client.println("<p><a href=\"/fan/on\"><button class=\"btn btn-on\">เปิดพัดลมระบายอากาศ</button></a></p>");
            }
            
            client.println("</body></html>");
            break;
          } else {
            // ค้นหาพาธของปุ่มกดเพื่อตั้งค่าสถานะรีเลย์ควบคุม
            if (currentRequestLine.indexOf("GET /fan/on") >= 0) {
              fanState = true;
              digitalWrite(COOLING_FAN_RELAY, HIGH);
              Serial.println("[Control] สั่งการ: เปิดพัดลมระบายอากาศ");
            } else if (currentRequestLine.indexOf("GET /fan/off") >= 0) {
              fanState = false;
              digitalWrite(COOLING_FAN_RELAY, LOW);
              Serial.println("[Control] สั่งการ: ปิดพัดลมระบายอากาศ");
            }
            currentRequestLine = "";
          }
        } else if (c != '\r') {
          currentRequestLine += c;
        }
      }
    }
    client.stop(); // ทำการตัดการเชื่อมต่อกับ Client ทันทีหลังจากส่งหน้าเว็บเสร็จสิ้น
    Serial.println("[Server] ปิดการเชื่อมต่อ Client");
  }

  // 3. งานอื่นๆ ในระบบวนซ้ำ โดยไม่ถูกขัดจังหวะจากเน็ตเวิร์ก
  // เช่น ตรวจสอบระบบ Safety ของเครื่องจักร หรือทำระบบ Watchdog เซ็นเซอร์
}
```

---

## 6.3 Bluetooth และ BLE (Bluetooth Low Energy)

Bluetooth เป็นโปรโตคอลการสื่อสารไร้สายระยะสั้น (ปกติ < 100 เมตร) ทำงานที่ความถี่ 2.4 GHz เช่นเดียวกับ Wi-Fi แต่มีวัตถุประสงค์การออกแบบและพฤติกรรมการใช้งานที่แตกต่างกันโดยสิ้นเชิง

### 6.3.1 ความแตกต่างระหว่าง Bluetooth Classic และ BLE

แม้จะใช้แบรนด์ชื่อ "Bluetooth" ร่วมกัน แต่บลูทูธคลาสสิกและบลูทูธพลังงานต่ำ (BLE) ถือเป็นสถาปัตยกรรมระดับฮาร์ดแวร์และซอฟต์แวร์ที่แทบไม่ทับซ้อนกันเลย:

| เกณฑ์เปรียบเทียบ (Parameters) | Bluetooth Classic (BR/EDR) | Bluetooth Low Energy (BLE) |
|---|---|---|
| **ช่องสัญญาณวิทยุ (Channels)** | 79 ช่องสัญญาณ (กว้างช่องละ 1 MHz) | 40 ช่องสัญญาณ (กว้างช่องละ 2 MHz) |
| **ความจุการส่งข้อมูล (Throughput)** | สูง (1 Mbps ถึง 3 Mbps) | ต่ำ (100 kbps ถึง 2 Mbps ระดับทางกายภาพ) |
| **รูปแบบการสื่อสาร (Traffic Pattern)** | **เน้นส่งข้อมูลต่อเนื่อง (Streaming)** เช่น ส่งสัญญาณเสียง ลำโพง โทรศัพท์ | **เน้นส่งข้อมูลสั้น ๆ เป็นช่วงเวลา (Burst/Packet-oriented)** เช่น ค่าอุณหภูมิ สถานะปุ่ม |
| **การใช้พลังงาน (Power Consumption)** | ปานกลางถึงสูง (~1 วัตต์ หรือ 30 mA ระหว่างเชื่อมต่อ) | ต่ำมากเป็นพิเศษ (กระแสช่วงหลับ < 15 $\mu$A, ช่วงส่งวิทยุ ~10-15 mA) |
| **ระยะเวลาเชื่อมต่อใหม่ (Latency/Setup Time)** | ช้ามาก (~3 วินาที ถึง 5 วินาที) | เร็วมากเป็นพิเศษ (< 6-10 มิลลิวินาที) |
| **จำนวนอุปกรณ์ลูกข่าย (Topology Limit)** | สูงสุด 7 อุปกรณ์ (ในวงเครือข่าย Piconet) | ทางทฤษฎีไม่จำกัด ขึ้นกับหน่วยความจำของ Master |
| **อายุการใช้งานแบตเตอรี่ (Battery Life)** | สั้น (ชั่วโมงถึงไม่กี่วัน) | ยาวนานมาก (เป็นปีหรือหลายปีจากถ่านกระดุม CR2032) |

### 6.3.2 สถาปัตยกรรม GATT (Generic Attribute Profile)

BLE ใช้โครงสร้างข้อมูลที่เป็นรูปแบบชั้นสถาปัตยกรรมแบบ **GATT (Generic Attribute Profile)** เพื่อจัดระเบียบข้อมูลที่มีอยู่ภายในตัวเครื่องรับส่งสัญญาณ:

<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 760 380" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <title>BLE Profile and GATT Hierarchy</title>
  <style>
    .bg { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1.5; rx: 12px; }
    .client-box { fill: #ffffff; stroke: #334155; stroke-width: 2; rx: 8px; }
    .client-screen { fill: #faf5ff; stroke: #7c3aed; stroke-width: 1.5; rx: 6px; }
    .profile-box { fill: #ffffff; stroke: #334155; stroke-width: 2; rx: 8px; }
    .service-box { fill: #faf5ff; stroke: #7c3aed; stroke-width: 2; rx: 6px; }
    .char-box { fill: #ffffff; stroke: #334155; stroke-width: 1.5; rx: 4px; }
    .value-box { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1; rx: 4px; }
    
    .text-title { font-size: 13px; font-weight: 700; fill: #334155; }
    .text-subtitle { font-size: 11px; fill: #475569; }
    .text-uuid { font-size: 10px; font-family: monospace; fill: #7c3aed; font-weight: 700; }
    .prop-pill { fill: #faf5ff; stroke: #7c3aed; stroke-width: 1; rx: 3px; }
    .prop-text { font-size: 9.5px; fill: #7c3aed; font-weight: bold; }
    
    .comm-path-req { fill: none; stroke: #f59e0b; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 8 6; animation: marchRight 1.5s linear infinite; }
    .comm-path-notif { fill: none; stroke: #16a34a; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 8 6; animation: marchLeft 1.5s linear infinite; }
    
    @keyframes marchRight {
      to { stroke-dashoffset: -14; }
    }
    @keyframes marchLeft {
      to { stroke-dashoffset: 14; }
    }
  </style>

  <rect x="5" y="5" width="750" height="370" class="bg"/>

  <!-- Client Section -->
  <g id="gatt-client">
    <rect x="30" y="40" width="150" height="300" class="client-box" />
    <text x="105" y="65" fill="#334155" font-size="13" font-weight="bold" text-anchor="middle">GATT Client (ลูกข่าย)</text>
    <text x="105" y="80" fill="#475569" font-size="10.5" text-anchor="middle">(แอปมือถือ / คอนโทรลเลอร์)</text>
    
    <!-- Screen representation -->
    <rect x="42" y="100" width="126" height="220" class="client-screen" />
    
    <!-- Read Request Button on Screen -->
    <rect x="52" y="125" width="106" height="50" class="client-box" />
    <text x="105" y="145" fill="#334155" font-size="11" font-weight="bold" text-anchor="middle">Read Request</text>
    <text x="105" y="160" fill="#f59e0b" font-size="9.5" font-weight="bold" text-anchor="middle">ส่งคำขออ่านค่า</text>
    
    <!-- Notification Display on Screen -->
    <rect x="52" y="215" width="106" height="50" class="client-box" />
    <text x="105" y="235" fill="#334155" font-size="11" font-weight="bold" text-anchor="middle">Notification</text>
    <text x="105" y="250" fill="#16a34a" font-size="9.5" font-weight="bold" text-anchor="middle">รับการแจ้งเตือน</text>
  </g>

  <!-- Server Section -->
  <g id="gatt-server">
    <!-- Profile Box -->
    <rect x="210" y="40" width="520" height="300" class="profile-box" />
    <text x="225" y="60" class="text-title">BLE Profile: โครงร่างความต้องการของระบบ</text>
    
    <!-- Service Box -->
    <rect x="225" y="75" width="490" height="250" class="service-box" />
    <text x="240" y="98" class="text-title" style="fill: #7c3aed;">Environmental Sensing Service (บริการวัดสิ่งแวดล้อม)</text>
    <text x="240" y="113" class="text-uuid">UUID: 0x181A</text>
    
    <!-- Characteristic A: Temperature -->
    <rect x="240" y="130" width="460" height="80" class="char-box" />
    <text x="255" y="152" class="text-title">Characteristic: Temperature (ค่าอุณหภูมิ)</text>
    <text x="255" y="167" class="text-uuid">UUID: 0x2A6E</text>
    
    <!-- Properties for A -->
    <g transform="translate(255, 178)">
      <rect x="0" y="0" width="38" height="18" class="prop-pill" />
      <text x="19" y="12" class="prop-text" text-anchor="middle">Read</text>
      <rect x="44" y="0" width="42" height="18" class="prop-pill" />
      <text x="65" y="12" class="prop-text" text-anchor="middle">Notify</text>
    </g>
    
    <!-- Value Box for A -->
    <rect x="525" y="138" width="160" height="64" class="value-box" />
    <text x="535" y="156" class="text-subtitle" style="font-weight: bold;">ค่า (Value): <tspan fill="#7c3aed">28.50 °C</tspan></text>
    <text x="535" y="174" class="text-subtitle" style="font-size: 9.5px; fill: #64748b;">Descriptor: CCCD (0x2902)</text>
    <text x="535" y="188" class="text-subtitle" style="font-size: 9.5px; fill: #64748b;">(การตั้งค่าการแจ้งเตือน)</text>

    <!-- Characteristic B: Humidity -->
    <rect x="240" y="230" width="460" height="80" class="char-box" />
    <text x="255" y="252" class="text-title">Characteristic: Humidity (ค่าความชื้น)</text>
    <text x="255" y="267" class="text-uuid">UUID: 0x2A6F</text>
    
    <!-- Properties for B -->
    <g transform="translate(255, 278)">
      <rect x="0" y="0" width="38" height="18" class="prop-pill" />
      <text x="19" y="12" class="prop-text" text-anchor="middle">Read</text>
      <rect x="44" y="0" width="42" height="18" class="prop-pill" />
      <text x="65" y="12" class="prop-text" text-anchor="middle">Notify</text>
    </g>
    
    <!-- Value Box for B -->
    <rect x="525" y="238" width="160" height="64" class="value-box" />
    <text x="535" y="156" class="text-subtitle" style="font-weight: bold;">ค่า (Value): <tspan fill="#7c3aed">65.20%</tspan></text>
    <text x="535" y="174" class="text-subtitle" style="font-size: 9.5px; fill: #64748b;">Descriptor: User Desc</text>
    <text x="535" y="188" class="text-subtitle" style="font-size: 9.5px; fill: #64748b;">(ป้ายชื่อลักษณะเฉพาะ)</text>
  </g>

  <!-- Flow lines with marching animation -->
  <path d="M 158 150 C 180 150, 200 150, 240 150" class="comm-path-req" />
  <path d="M 240 162 C 200 162, 180 240, 158 240" class="comm-path-notif" />
</svg>
</div>

*   **Profile:** ชุดการจัดวางบริการทั้งหมดที่ระบุพฤติกรรมโดยรวมและหน้าที่ของอุปกรณ์ (เช่น Profile ของสายรัดข้อมือออกกำลังกาย)
*   **Service:** กลุ่มข้อมูลหรือฟังก์ชันที่มีความสัมพันธ์กัน ภายใน Service จะรวบรวม Characteristic หลายตัวเข้าด้วยกัน เพื่อระบุเฉพาะเจาะจงจะใช้รหัส **UUID (Universal Unique Identifier)** ขนาด 16 บิต (สำหรับมาตรฐานของหน่วยงาน Bluetooth SIG) หรือขนาด 128 บิต (สำหรับฟังก์ชันสร้างพิเศษ)
*   **Characteristic:** เป็นที่เก็บบันทึกข้อมูลดิบจริง ๆ ของเซ็นเซอร์หรือคำสั่ง มีองค์ประกอบย่อยคือ:
    *   *Value:* ข้อมูลหรือค่าที่ต้องการสื่อสาร (เช่น อาร์เรย์ของข้อมูลตัวเลข/ตัวอักษร)
    *   *Property:* กำหนดว่า Client สามารถเข้าทำอะไรกับค่านี้ได้บ้าง เช่น **Read** (อ่านค่า), **Write** (เขียนทับเพื่อสั่งงาน), **Notify** (เซิร์ฟเวอร์ส่งค่าออกไปแจ้งเตือนฝั่ง Client โดยไม่ต้องตอบรับ), หรือ **Indicate** (ส่งคำเตือนและต้องการให้ Client ตอบรับ ACK)
*   **Descriptor:** รายละเอียดเพิ่มเติมที่ติดอยู่กับ Characteristic เช่น บอกหน่วยวัด ขอบเขตค่าสูงสุดต่ำสุด หรือใช้สำหรับเปิด/ปิดโหมดการแจ้งเตือน (Client Characteristic Configuration Descriptor - CCCD)
*   **UUID (Universal Unique Identifier):** หมายเลข 128 บิตที่ใช้ระบุตัวตนของอุปกรณ์หรือบริการที่ไม่ซ้ำกันทั่วโลก ตัวอย่างเช่น:
    *   *มาตรฐาน 16-bit UUID (ใช้โครงสร้างฐานร่วม `0000XXXX-0000-1000-8000-00805f9b34fb`):*
        *   `0x181A` = Environmental Sensing Service (บริการเซ็นเซอร์สิ่งแวดล้อม)
        *   `0x2A6E` = Temperature Characteristic (ข้อมูลค่าอุณหภูมิ)
    *   *Custom 128-bit UUID (ใช้เพื่อความปลอดภัยไม่ปนกับบริการทั่วไป):*
        *   `9a48ec82-2e7a-422f-ad3d-c782782b54bf` (สุ่มขึ้นมาเฉพาะสำหรับโปรเจกต์)

### 6.3.3 กระบวนการสื่อสาร: Advertising vs Connection

การทำงานของ BLE มี 2 สถานะพฤติกรรมหลักเพื่อความยืดหยุ่นและการประหยัดพลังงาน:

#### 1. สถานะกระจายสัญญาณโฆษณา (Advertising State)
*   อุปกรณ์ทำหน้าที่เป็น **Peripheral (โหนดปลายทาง)** จะแพร่สัญญาณคลื่นสั้นออกอากาศผ่านช่องสัญญาณวิทยุพิเศษ 3 ช่อง (ช่องความถี่ 37, 38 และ 39 เพื่อหลีกเลี่ยงการถูกชนจาก Wi-Fi) เรียกว่า **Advertising Packets** ทุกๆ ช่วงเวลาที่กำหนด (Advertising Interval)
*   อุปกรณ์รอบข้างที่เป็น **Central (ตัวรับหลัก/มือถือ)** สามารถค้นหาสัญญาณเพื่อสแกนอ่านข้อมูลเบื้องต้นได้ทันที เช่น ชื่อเครื่อง และข้อมูลสั้น ๆ ในช่องโฆษณา (เช่น อุปกรณ์ Beacon ส่งค่าพิกัดพอยเตอร์ร้านค้า) โดยไม่ต้องเข้ามาสร้างการเชื่อมต่อจริง ๆ ช่วยประหยัดแบตเตอรี่ได้มากที่สุด

#### 2. สถานะสร้างการเชื่อมต่ออย่างเป็นทางการ (Connection State)
*   เมื่อ Central ตัดสินใจเชื่อมโยงสร้างลิงก์กับ Peripheral จะส่งคำขอเชื่อมต่อ อุปกรณ์ Peripheral จะเปลี่ยนบทบาทมาจับคู่อย่างเป็นทางการและทำหน้าเป็น **GATT Server** คอยป้อนข้อมูล ส่วน Central จะรับหน้าที่เป็น **GATT Client** คอยอ่านหรือเขียนข้อมูล
*   การส่งข้อมูลระหว่างกันจะกระทำโดยตรงผ่านหน้าต่างส่งที่มีการขยับและกวาดความถี่ (Frequency Hopping) ครอบคลุมทั้ง 37 ช่องที่เหลือเพื่อหลีกเลี่ยงการโดนสัญญาณคลื่นวิทยุตัวอื่นมารบกวนและเพิ่มความปลอดภัยของข้อมูล

---

### 6.3.4 ตัวอย่างโค้ด ESP32 BLE GATT Server (Environmental Service)

โค้ด Arduino C++ สำหรับรันบน ESP32 เพื่อทำหน้าที่เป็น BLE GATT Server ทำการแพร่กระจายสัญญาณโฆษณา และรับส่งข้อมูลค่าเซ็นเซอร์อุณหภูมิสิ่งแวดล้อมรวมถึงรอรับคำสั่งควบคุมจากสมาร์ตโฟน:

```cpp
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <BLE2902.h>

// กำหนด UUID ตามมาตรฐานของ Bluetooth SIG (ย่านสิ่งแวดล้อม)
#define ENV_SERVICE_UUID      "0000181a-0000-1000-8000-00805f9b34fb"
#define TEMP_CHAR_UUID        "00002a6e-0000-1000-8000-00805f9b34fb"

// กำหนด Custom 128-bit UUID สำหรับฟังก์ชันรับคำสั่งทางวิศวกรรม
#define CTRL_SERVICE_UUID     "9a48ec82-2e7a-422f-ad3d-c782782b54bf"
#define RELAY_CHAR_UUID       "c3d69dd4-4d89-4cd7-bf53-9d41c888e2c2"

BLEServer* pServer = NULL;
BLECharacteristic* pTempChar = NULL;
BLECharacteristic* pRelayChar = NULL;

bool isClientConnected = false;
bool wasClientConnected = false;
unsigned long prevNotifyTime = 0;
const unsigned long notifyPeriod = 3000; // ส่ง Notify อัปเดตทุก 3 วินาที

// Callback สำหรับรับรู้การต่อเข้า/หลุดออกของ Client
class ServerStatusCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      isClientConnected = true;
      Serial.println("[BLE] Client เชื่อมต่อเข้าระบบแล้ว");
    }

    void onDisconnect(BLEServer* pServer) {
      isClientConnected = false;
      Serial.println("[BLE] Client ตัดการเชื่อมต่อ");
    }
};

// Callback สำหรับรอรับการเขียนข้อมูลเปลี่ยนสถานะ (Write) จาก Client
class CommandReceiverCallbacks: public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic) {
      std::string receivedData = pCharacteristic->getValue();
      
      if (receivedData.length() > 0) {
        Serial.println("\n----------------------------------------");
        Serial.print("[BLE Control] ได้รับคำสั่งสั่งการ: ");
        for (int i = 0; i < receivedData.length(); i++) {
          Serial.print(receivedData[i]);
        }
        Serial.println();
        
        // เปรียบเทียบคำสั่ง
        if (receivedData == "ACTIVATE") {
          Serial.println("[BLE Control] ผลลัพธ์: เปิดทำงานระบบวาล์วน้ำหลัก");
        } else if (receivedData == "DEACTIVATE") {
          Serial.println("[BLE Control] ผลลัพธ์: ปิดการทำงานระบบวาล์วน้ำหลัก");
        } else {
          Serial.println("[BLE Control] ผลลัพธ์: ไม่พบคำสั่งทางวิศวกรรมที่กำหนด");
        }
        Serial.println("----------------------------------------");
      }
    }
};

void setup() {
  Serial.begin(115200);

  // 1. เริ่มต้นอุปกรณ์ BLE ด้วยชื่ออุปกรณ์เฉพาะตัว
  BLEDevice::init("ME_Telemetry_Node_01");

  // 2. สร้างโครงร่าง GATT Server
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new ServerStatusCallbacks());

  // 3. สร้างกลุ่มบริการสำหรับอ่านค่าอุณหภูมิ (Environmental Service)
  BLEService *pEnvService = pServer->createService(ENV_SERVICE_UUID);

  // สร้างคุณลักษณะอุณหภูมิ (Read และ Notify)
  pTempChar = pEnvService->createCharacteristic(
                TEMP_CHAR_UUID,
                BLECharacteristic::PROPERTY_READ |
                BLECharacteristic::PROPERTY_NOTIFY
              );
              
  // จำเป็นอย่างยิ่งในการเพิ่ม Descriptor 0x2902 เพื่ออนุญาตการแจ้งเตือน
  pTempChar->addDescriptor(new BLE2902());

  // เริ่มการทำงานของบริการแรก
  pEnvService->start();

  // 4. สร้างกลุ่มบริการสำหรับรับข้อมูลควบคุม (Custom Control Service)
  BLEService *pCtrlService = pServer->createService(CTRL_SERVICE_UUID);

  // สร้างคุณลักษณะรับสัญญาณเขียนรีเลย์ (Property Write)
  pRelayChar = pCtrlService->createCharacteristic(
                 RELAY_CHAR_UUID,
                 BLECharacteristic::PROPERTY_WRITE
               );
  pRelayChar->setCallbacks(new CommandReceiverCallbacks());

  // เริ่มการทำงานของบริการควบคุม
  pCtrlService->start();

  // 5. จัดตารางการโฆษณา (Advertising Config) เพื่อให้สมาร์ตโฟนค้นพบ
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(ENV_SERVICE_UUID);
  pAdvertising->addServiceUUID(CTRL_SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06); // ค่าเกณฑ์ช่วยแก้ปัญหาสำหรับบางอุปกรณ์
  pAdvertising->setMinPreferred(0x12);
  
  BLEDevice::startAdvertising();
  Serial.println("[BLE] ระบบพร้อมแพร่โฆษณาค้นหาคู่เชื่อมต่อ...");
}

void loop() {
  unsigned long now = millis();

  // หาก Client ต่ออยู่ ให้อัปเดตค่าอุณหภูมิเป็นระยะๆ
  if (isClientConnected) {
    if (now - prevNotifyTime >= notifyPeriod) {
      // จำลองการอ่านข้อมูลอุณหภูมิจากเครื่องจักร (เช่น 35.67 C)
      float simulatedTemp = 35.0 + (random(0, 100) / 50.0);
      
      // การเก็บรูปแบบ Bluetooth SIG: อุณหภูมิส่งแบบ int16_t คูณ 100 เพื่อเลี่ยงทศนิยม
      int16_t tempPayload = (int16_t)(simulatedTemp * 100);
      
      // ส่งข้อมูลด้วยขนาด 2 ไบต์ทางอักษรวิญญาณ
      pTempChar->setValue((uint8_t*)&tempPayload, 2);
      pTempChar->notify(); // แจ้งเตือนส่งข้อมูลออกไปทันที
      
      Serial.print("[BLE Telemetry] ส่งค่าอุณหภูมิแจ้งเตือน: ");
      Serial.print(simulatedTemp);
      Serial.println(" °C");
      
      prevNotifyTime = now;
    }
  }

  // 6. กลไกจัดการเริ่มสัญญาณ Advertising ใหม่เมื่อ Client ตัดสัมพันธ์ (Auto-Restart Advertising)
  if (!isClientConnected && wasClientConnected) {
    delay(500); // ช่วงหน่วงเวลาสั้นๆ เพื่อเคลียร์พอร์ตระดับล่าง
    BLEDevice::startAdvertising();
    Serial.println("[BLE] กำลังเริ่มการแพร่สัญญาณโฆษณาใหม่อีกครั้ง...");
    wasClientConnected = isClientConnected;
  }
  
  if (isClientConnected && !wasClientConnected) {
    wasClientConnected = isClientConnected;
  }
}
```

---

## 6.4 Zigbee (IEEE 802.15.4)

Zigbee คือโปรโตคอลการสื่อสารไร้สายระยะสั้นถึงปานกลางที่ออกแบบมาเพื่อ **ประหยัดพลังงานเป็นพิเศษและมีความจุการเชื่อมโยงระบบสูง** ทำงานบนชั้นกายภาพ (Physical Layer) และชั้นการควบคุมการเข้าถึงสื่อ (MAC Layer) ของมาตรฐานสากล **IEEE 802.15.4**

### 6.4.1 มาตรฐานย่านความถี่และช่องสัญญาณ

มาตรฐาน IEEE 802.15.4 ทำงานในสามย่านความถี่วิทยุหลัก:
*   **ย่าน 2.4 GHz:** ใช้งานแพร่หลายทั่วโลก มีช่องสัญญาณให้ใช้งาน 16 ช่อง (ช่องที่ 11 ถึง 26) อัตราส่งข้อมูลคงที่ที่ **250 kbps**
*   **ย่าน 915 MHz:** ใช้งานในโซนอเมริกา อัตราส่งข้อมูล 40 kbps
*   **ย่าน 868 MHz:** ใช้งานในยุโรป อัตราส่งข้อมูล 20 kbps

### 6.4.2 โทโพโลยีเครือข่ายแบบ Mesh และการค้นหาเส้นทาง

จุดเด่นที่เหนือกว่า Wi-Fi และ BLE ทั่วไปของ Zigbee คือ การทำงานแบบ **Mesh Topology (โครงข่ายแบบใยแมงมุม)** ซึ่งรองรับการส่งข้อมูลระหว่างกันเป็นทอด ๆ (Multi-hop Routing)

<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 760 350" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <title>Zigbee Mesh Topology and Self-Healing</title>
  <style>
    .bg { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1.5; rx: 12px; }
    .node-zc { fill: #faf5ff; stroke: #7c3aed; stroke-width: 2; rx: 8px; }
    .node-zr { fill: #ffffff; stroke: #334155; stroke-width: 2; rx: 6px; }
    .node-zed { fill: #ffffff; stroke: #cbd5e1; stroke-width: 1.5; rx: 4px; }
    
    .link { stroke: #cbd5e1; stroke-width: 2; stroke-linecap: round; }
    .link-active { stroke: #16a34a; stroke-width: 2.5; stroke-linecap: round; }
    .link-broken { stroke: #dc2626; stroke-width: 2; stroke-dasharray: 4 4; stroke-linecap: round; }
    
    .label-title { font-size: 12px; font-weight: 700; fill: #334155; text-anchor: middle; }
    .label-sub { font-size: 10px; fill: #475569; text-anchor: middle; }
    
    .failed-router { fill: #ffffff; stroke: #334155; stroke-width: 2; rx: 6px; animation: routerFail 8s infinite; }
    .failed-cross { stroke: #dc2626; stroke-width: 3; stroke-linecap: round; opacity: 0; animation: crossAppear 8s infinite; }
    
    .packet-trail-normal { fill: none; stroke: #f59e0b; stroke-width: 4; stroke-linecap: round; stroke-dasharray: 12 300; stroke-dashoffset: 0; animation: packetNormal 8s infinite linear; }
    .packet-trail-healed { fill: none; stroke: #16a34a; stroke-width: 4; stroke-linecap: round; stroke-dasharray: 12 600; stroke-dashoffset: 0; opacity: 0; animation: packetHealed 8s infinite linear; }
    
    .heal-link { stroke: #cbd5e1; stroke-width: 2; stroke-dasharray: 4 4; animation: healLinkHighlight 8s infinite; }
    .active-link-normal { stroke: #f59e0b; stroke-width: 2; animation: linkNormalActive 8s infinite; }
    
    .status-banner { fill: #334155; rx: 6px; }
    .status-text { font-size: 12px; fill: #ffffff; font-weight: bold; text-anchor: middle; }
    .status-lbl-normal { opacity: 0; animation: showLblNormal 8s infinite; }
    .status-lbl-fail { opacity: 0; animation: showLblFail 8s infinite; }
    .status-lbl-heal { opacity: 0; animation: showLblHeal 8s infinite; }

    @keyframes routerFail {
      0%, 39% { fill: #ffffff; stroke: #334155; }
      40%, 89% { fill: #faf5ff; stroke: #dc2626; }
      90%, 100% { fill: #ffffff; stroke: #334155; }
    }
    @keyframes crossAppear {
      0%, 39% { opacity: 0; }
      40%, 89% { opacity: 1; }
      90%, 100% { opacity: 0; }
    }
    @keyframes packetNormal {
      0% { stroke-dashoffset: 0; opacity: 0; }
      5% { opacity: 1; }
      30% { stroke-dashoffset: -200; opacity: 1; }
      31%, 100% { stroke-dashoffset: -200; opacity: 0; }
    }
    @keyframes packetHealed {
      0%, 45% { stroke-dashoffset: 0; opacity: 0; }
      46% { opacity: 1; }
      80% { stroke-dashoffset: -460; opacity: 1; }
      81%, 100% { stroke-dashoffset: -460; opacity: 0; }
    }
    @keyframes healLinkHighlight {
      0%, 39% { stroke: #cbd5e1; stroke-width: 1.5; stroke-dasharray: 4 4; }
      40%, 89% { stroke: #16a34a; stroke-width: 2.5; stroke-dasharray: none; }
      90%, 100% { stroke: #cbd5e1; stroke-width: 1.5; stroke-dasharray: 4 4; }
    }
    @keyframes linkNormalActive {
      0%, 39% { stroke: #f59e0b; stroke-width: 2.5; }
      40%, 100% { stroke: #cbd5e1; stroke-width: 1.5; }
    }
    @keyframes showLblNormal {
      0%, 39% { opacity: 1; }
      40%, 100% { opacity: 0; }
    }
    @keyframes showLblFail {
      0%, 39% { opacity: 0; }
      40%, 59% { opacity: 1; }
      60%, 100% { opacity: 0; }
    }
    @keyframes showLblHeal {
      0%, 59% { opacity: 0; }
      60%, 89% { opacity: 1; }
      90%, 100% { opacity: 0; }
    }
  </style>

  <rect x="5" y="5" width="750" height="340" class="bg"/>

  <!-- Links -->
  <line x1="220" y1="160" x2="140" y2="260" class="link" />
  <line x1="220" y1="160" x2="260" y2="260" class="link" />
  <line x1="540" y1="160" x2="540" y2="260" class="link" />
  <line x1="380" y1="60" x2="220" y2="160" class="link" />
  <line x1="380" y1="60" x2="380" y2="160" class="active-link-normal" />
  <line x1="380" y1="160" x2="380" y2="260" class="active-link-normal" />
  <line x1="380" y1="260" x2="540" y2="160" class="heal-link" />
  <line x1="540" y1="160" x2="220" y2="160" class="heal-link" />
  <line x1="220" y1="160" x2="380" y2="60" class="heal-link" />

  <!-- Animated packet trails -->
  <path d="M 380 260 L 380 160 L 380 60" class="packet-trail-normal" />
  <path d="M 380 260 L 540 160 L 220 160 L 380 60" class="packet-trail-healed" />

  <!-- Nodes -->
  <g transform="translate(320, 25)">
    <rect x="0" y="0" width="120" height="50" class="node-zc" />
    <text x="60" y="24" class="label-title" style="fill: #7c3aed;">Coordinator (ZC)</text>
    <text x="60" y="38" class="label-sub" style="font-weight: bold;">ผู้ประสานงานหลัก</text>
  </g>

  <g transform="translate(170, 140)">
    <rect x="0" y="0" width="100" height="40" class="node-zr" />
    <text x="50" y="20" class="label-title">Router (ZR1)</text>
    <text x="50" y="32" class="label-sub">โหนดส่งต่อข้อมูล 1</text>
  </g>

  <g transform="translate(330, 140)">
    <rect x="0" y="0" width="100" height="40" class="failed-router" />
    <text x="50" y="20" class="label-title">Router (ZR2)</text>
    <text x="50" y="32" class="label-sub">โหนดส่งต่อข้อมูล 2</text>
    <line x1="15" y1="10" x2="85" y2="30" class="failed-cross" />
    <line x1="85" y1="10" x2="15" y2="30" class="failed-cross" />
  </g>

  <g transform="translate(490, 140)">
    <rect x="0" y="0" width="100" height="40" class="node-zr" />
    <text x="50" y="20" class="label-title">Router (ZR3)</text>
    <text x="50" y="32" class="label-sub">โหนดส่งต่อข้อมูล 3</text>
  </g>

  <g transform="translate(95, 245)">
    <rect x="0" y="0" width="90" height="35" class="node-zed" />
    <text x="45" y="17" class="label-title" style="font-size: 11px;">End Device</text>
    <text x="45" y="27" class="label-sub" style="font-size: 9px;">ZED1 (ลูกข่าย)</text>
  </g>

  <g transform="translate(215, 245)">
    <rect x="0" y="0" width="90" height="35" class="node-zed" />
    <text x="45" y="17" class="label-title" style="font-size: 11px;">End Device</text>
    <text x="45" y="27" class="label-sub" style="font-size: 9px;">ZED2 (ลูกข่าย)</text>
  </g>

  <g transform="translate(325, 240)">
    <rect x="0" y="0" width="110" height="40" class="node-zed" style="stroke: #7c3aed; fill: #faf5ff; stroke-width: 2;" />
    <text x="55" y="18" class="label-title" style="font-size: 11px; fill: #7c3aed;">ZED3 (เซ็นเซอร์)</text>
    <text x="55" y="30" class="label-sub" style="font-size: 9px; fill: #7c3aed; font-weight: bold;">โหนดเริ่มส่งข้อมูล</text>
  </g>

  <g transform="translate(495, 245)">
    <rect x="0" y="0" width="90" height="35" class="node-zed" />
    <text x="45" y="17" class="label-title" style="font-size: 11px;">End Device</text>
    <text x="45" y="27" class="label-sub" style="font-size: 9px;">ZED4 (ลูกข่าย)</text>
  </g>

  <!-- Status Banner -->
  <g transform="translate(180, 298)">
    <rect x="0" y="0" width="400" height="30" class="status-banner" />
    <g class="status-lbl-normal">
      <text x="200" y="19" class="status-text">สถานะ: ปกติ (ZED3 → ZR2 → ZC)</text>
      <circle cx="25" cy="15" r="5" fill="#16a34a" />
    </g>
    <g class="status-lbl-fail">
      <text x="200" y="19" class="status-text" style="fill: #dc2626;">ขัดข้อง: ZR2 ขัดข้อง / ตัดการทำงาน</text>
      <circle cx="25" cy="15" r="5" fill="#dc2626" />
    </g>
    <g class="status-lbl-heal">
      <text x="200" y="19" class="status-text" style="fill: #f59e0b;">เยียวยาตนเอง: เปลี่ยนเส้นทาง (ZR3 → ZR1 → ZC)</text>
      <circle cx="25" cy="15" r="5" fill="#f59e0b" />
    </g>
  </g>
</svg>
</div>

*   **กระบวนการส่งแบบ Multi-hop:** โหนดรับส่งจะไม่ได้จำกัดการคุยกับแม่ข่ายใหญ่ตัวเดียว แต่สามารถส่งจดหมายข้อมูลฝากผ่านเพื่อนร่วมทางไปยังจุดหมายปลายทางได้ ช่วยเพิ่มขอบเขตพื้นที่สัญญาณออกไปได้กว้างขวางมาก (สูงสุดหลายร้อยเมตร) โดยที่แต่ละโหนดไม่ต้องใช้แรงส่งวิทยุสูง
*   **ความสามารถในการเยียวยาตัวเอง (Self-Healing):** เครือข่าย Zigbee มีอัลกอริทึมค้นหาเส้นทางใหม่โดยอัตโนมัติ (เช่น AODV - Ad-hoc On-demand Distance Vector Routing) หากโหนดเราเตอร์ตัวใดตัวหนึ่งในเส้นทางปกติเสียหาย ดับไฟ หรือสัญญาณถูกคลื่นอื่นบังชั่วคราว ข้อมูลจะสลับวิ่งไปอีกเส้นทางที่ว่างและใช้การได้ทันที ทำให้เครือข่ายมีเสถียรภาพและความน่าเชื่อถือสูงมากในโรงงานที่มีการรบกวนทางวิทยุสูง

### 6.4.3 บทบาทหน้าที่ของอุปกรณ์ในระบบ Zigbee

ในระบบเครือข่ายของ Zigbee หนึ่งเครือข่ายจะแบ่งหน้าที่ของแต่ละอุปกรณ์ออกเป็น 3 บทบาทหลัก:

1.  **Zigbee Coordinator (ZC - ผู้ประสานงานหลัก):**
    *   ทำหน้าที่สำคัญที่สุดและ **ต้องมีเพียง 1 ตัวเสมอในหนึ่งเครือข่าย**
    *   เริ่มต้นสร้างโครงร่างระบบเครือข่าย คัดเลือกช่องความถี่ที่ปราศจากการรบกวน จ่ายรหัสความปลอดภัย (Security Keys) และกำหนดเลขที่อยู่ระยะสั้น (16-bit Network Address) ให้แก่สมาชิกใหม่ที่เข้าเครือข่าย
    *   ปกติต้องรับไฟเลี้ยงตลอดเวลา
2.  **Zigbee Router (ZR - ตัวสลับและส่งต่อ):**
    *   ทำหน้าที่เป็นตัวผ่านกระจายสัญญาณและสลับเส้นทางการเดินเรือข้อมูลเพื่อโยนข้ามทอดไปยังเครื่องอื่น
    *   สามารถทำหน้าเป็นตัวควบคุมสัญญาณ และเชื่อมต่อรับข้อมูลจากอุปกรณ์ปลายทางตัวอื่นได้
    *   ต้องการไฟเลี้ยงคงที่ (Main Powered) เสมอเนื่องจากจำเป็นต้องเปิดวิทยุรับส่งสัญญาณรอตลอดเวลา
3.  **Zigbee End Device (ZED - โหนดปลายทางประหยัดพลังงาน):**
    *   อุปกรณ์เซ็นเซอร์หรือสวิตช์ควบคุมปลายทาง สื่อสารตรงเฉพาะกับโหนดแม่ (Parent Node) ของตนเท่านั้น (อาจเป็น ZC หรือ ZR)
    *   สามารถปิดสแตนด์บายวิทยุและเข้าสู่โหมดหลับลึก (Deep Sleep) เพื่อประหยัดพลังงานสูงสุด โดยโหนดแม่จะช่วยจดจำและบันทึกข้อมูลฝากเอาไว้ชั่วคราว เมื่อ ZED ตื่นขึ้นมาจะดึงข้อมูลนี้ออกไป (Polling) ทำให้ทำงานได้หลายปีด้วยแบตเตอรี่ก้อนเล็ก

---

## 6.5 LoRa และ LoRaWAN

LoRa และ LoRaWAN จัดอยู่ในประเภทกลุ่มเทคโนโลยี **LPWAN (Low Power Wide Area Network)** ซึ่งมุ่งเน้นการส่งสัญญาณข้อมูลระยะไกลเป็นกิโลเมตรด้วยพลังงานต่ำเป็นพิเศษแลกกับการจำกัดความกว้างช่องสัญญาณและปริมาณขนาดข้อมูล

### 6.5.1 การมอดูเลตแบบ LoRa (Chirp Spread Spectrum)

**LoRa (Long Range)** คือเทคโนโลยีชั้นกายภาพ (Physical Layer) ที่พัฒนาและถือครองสิทธิบัตรโดยบริษัท Semtech โดยใช้การเปลี่ยนรูปแบบสัญญาณแบบ **Chirp Spread Spectrum (CSS)** ซึ่งมีพฤติกรรมการเปลี่ยนสัญญาณความถี่สูงต่ำตามช่วงเวลา (เป็นคลื่นเสียงนกหวีด หรือ Chirp):

<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 760 280" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <title>LoRa CSS Up-Chirps</title>
  <style>
    .bg { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1.5; rx: 12px; }
    .grid-line { stroke: #cbd5e1; stroke-width: 1; stroke-dasharray: 4 4; }
    .axis-line { stroke: #334155; stroke-width: 2.5; stroke-linecap: round; }
    
    .axis-label { font-size: 11px; fill: #475569; font-weight: bold; }
    .title-text { font-size: 14px; fill: #334155; font-weight: bold; }
    .desc-text { font-size: 11px; fill: #64748b; }
    
    .chirp-base { fill: none; stroke: #cbd5e1; stroke-width: 2; stroke-linecap: round; }
    .chirp-active { fill: none; stroke: #7c3aed; stroke-width: 4; stroke-linecap: round; stroke-dasharray: 180; stroke-dashoffset: 180; }
    
    .c1 { animation: sweep 2.1s infinite linear; }
    .c2 { animation: sweep 2.1s infinite linear; animation-delay: 0.3s; }
    .c3 { animation: sweep 2.1s infinite linear; animation-delay: 0.6s; }
    .c4 { animation: sweep 2.1s infinite linear; animation-delay: 0.9s; }
    .c5 { animation: sweep 2.1s infinite linear; animation-delay: 1.2s; }
    .c6 { animation: sweep 2.1s infinite linear; animation-delay: 1.5s; }
    .c7 { animation: sweep 2.1s infinite linear; animation-delay: 1.8s; }

    @keyframes sweep {
      0% { stroke-dashoffset: 180; opacity: 0.2; }
      15% { opacity: 1; }
      85% { opacity: 1; }
      100% { stroke-dashoffset: 0; opacity: 0.2; }
    }
  </style>

  <rect x="5" y="5" width="750" height="270" class="bg"/>

  <!-- Grid lines -->
  <line x1="80" y1="180" x2="720" y2="180" class="grid-line" />
  <line x1="80" y1="130" x2="720" y2="130" class="grid-line" />
  <line x1="80" y1="80" x2="720" y2="80" class="grid-line" />
  <line x1="170" y1="50" x2="170" y2="230" class="grid-line" />
  <line x1="260" y1="50" x2="260" y2="230" class="grid-line" />
  <line x1="350" y1="50" x2="350" y2="230" class="grid-line" />
  <line x1="440" y1="50" x2="440" y2="230" class="grid-line" />
  <line x1="530" y1="50" x2="530" y2="230" class="grid-line" />
  <line x1="620" y1="50" x2="620" y2="230" class="grid-line" />

  <!-- Chirp base lines (gray background) -->
  <path d="M 90 220 L 170 60" class="chirp-base" />
  <path d="M 170 220 L 260 60" class="chirp-base" />
  <path d="M 260 220 L 350 60" class="chirp-base" />
  <path d="M 350 220 L 440 60" class="chirp-base" />
  <path d="M 440 220 L 530 60" class="chirp-base" />
  <path d="M 530 220 L 620 60" class="chirp-base" />
  <path d="M 620 220 L 710 60" class="chirp-base" />

  <!-- Active sweep animations -->
  <path d="M 90 220 L 170 60" class="chirp-active c1" />
  <path d="M 170 220 L 260 60" class="chirp-active c2" />
  <path d="M 260 220 L 350 60" class="chirp-active c3" />
  <path d="M 350 220 L 440 60" class="chirp-active c4" />
  <path d="M 440 220 L 530 60" class="chirp-active c5" />
  <path d="M 530 220 L 620 60" class="chirp-active c6" />
  <path d="M 620 220 L 710 60" class="chirp-active c7" />

  <!-- Axes -->
  <line x1="80" y1="230" x2="720" y2="230" class="axis-line" />
  <line x1="80" y1="40" x2="80" y2="230" class="axis-line" />
  
  <polygon points="76,45 80,35 84,45" fill="#334155" />
  <polygon points="715,226 725,230 715,234" fill="#334155" />

  <text x="50" y="130" class="axis-label" text-anchor="middle" transform="rotate(-90 50 130)">ความถี่ (Frequency)</text>
  <text x="690" y="255" class="axis-label" text-anchor="middle">เวลา (Time)</text>
  
  <text x="95" y="32" class="title-text">ลักษณะสัญญาณการมอดูเลตแบบ LoRa CSS (Up-chirps)</text>
  <text x="430" y="32" class="desc-text" fill="#64748b">กวาดความถี่สูงขึ้นตามเวลา (Sweep up in frequency over time)</text>
</svg>
</div>

การกระจายสัญญาณแบบนี้ทำให้เครื่องรับสัญญาณสามารถดึงและถอดรหัสสัญญาณของ LoRa ออกจากคลื่นสัญญาณรบกวนแวดล้อมได้ แม้ความแรงของวิทยุจะจมลึกต่ำกว่าระดับระนาบคลื่นรบกวนปกติ (Noise Floor) ถึง $-20\text{ dB}$ ตัวแปรสำคัญของการกำหนดค่าในชั้น LoRa ได้แก่:

*   **Spreading Factor (SF):** ค่าปัจจัยการคูณขยายความกว้างของรหัส (มีค่าตั้งแต่ SF7 ถึง SF12)
    *   *SF ต่ำ (SF7):* ข้อมูลส่งได้รวดเร็ว ใช้เวลาอยู่ในอากาศสั้น (Short Time-on-Air) แต่อุปกรณ์รับจะต้องไวต่อสัญญาณสูง เหมาะสำหรับระยะใกล้
    *   *SF สูง (SF12):* ข้อมูลเดินทางได้ระยะไกลมาก ทนทานสูงมาก แต่ความเร็วข้อมูลช้ามาก (Long Time-on-Air) และเปลืองพลังงานแบตเตอรี่ในอุปกรณ์มากกว่า
*   **Bandwidth (BW):** ความกว้างของย่านสัญญาณในการส่งวิทยุ มักใช้ค่ามาตรฐานที่ 125 kHz, 250 kHz หรือ 500 kHz
*   **Coding Rate (CR):** อัตราทดการเพิ่มบิตส่วนเกิด (Redundant Bits) เพื่อทำการซ่อมแซมข้อมูลหากเกิดข้อผิดพลาดในการรับ (Forward Error Correction - FEC) ตัวเลือกมาตรฐานคือ 4/5, 4/6, 4/7 หรือ 4/8

### 6.5.2 สถาปัตยกรรมเครือข่าย LoRaWAN

**LoRaWAN** คือโปรโตคอลชั้นเครือข่ายและระบบบริการ (MAC/Network Layer) ที่ทำงานครอบบนเทคโนโลยีสัญญาณวิทยุ LoRa โดยจัดสถาปัตยกรรมเครือข่ายในรูปแบบ **Star-of-Stars Topology**:

<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 760 320" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <title>LoRaWAN Star-of-Stars Topology</title>
  <style>
    .bg { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1.5; rx: 12px; }
    .mcu-box { fill: #faf5ff; stroke: #7c3aed; stroke-width: 2; rx: 8px; }
    .comp-box { fill: #ffffff; stroke: #334155; stroke-width: 2; rx: 4px; }
    
    .label-title { font-size: 12px; font-weight: 700; fill: #7c3aed; text-anchor: middle; }
    .label-sub { font-size: 10px; fill: #334155; text-anchor: middle; }
    .label-tech { font-size: 9.5px; fill: #f59e0b; font-weight: bold; text-anchor: middle; }
    
    .link-wire { stroke: #334155; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
    .link-wireless { stroke: #64748b; stroke-dasharray: 4 4; stroke-width: 1.5; }
    
    /* Animation packet flows */
    .packet-lora { fill: none; stroke: #f59e0b; stroke-width: 3.5; stroke-linecap: round; stroke-dasharray: 8 100; stroke-dashoffset: 0; animation: sendLoRa 6s infinite ease-in-out; }
    .packet-ip-gw-ns { fill: none; stroke: #16a34a; stroke-width: 3.5; stroke-linecap: round; stroke-dasharray: 12 100; stroke-dashoffset: 0; animation: sendIP1 6s infinite ease-in-out; }
    .packet-ip-ns-as { fill: none; stroke: #16a34a; stroke-width: 3.5; stroke-linecap: round; stroke-dasharray: 12 100; stroke-dashoffset: 0; animation: sendIP2 6s infinite ease-in-out; }

    @keyframes sendLoRa {
      0% { stroke-dashoffset: 0; opacity: 0; }
      5% { opacity: 1; }
      25%, 100% { stroke-dashoffset: -180; opacity: 0; }
    }
    @keyframes sendIP1 {
      0%, 25% { stroke-dashoffset: 0; opacity: 0; }
      30% { opacity: 1; }
      55%, 100% { stroke-dashoffset: -200; opacity: 0; }
    }
    @keyframes sendIP2 {
      0%, 55% { stroke-dashoffset: 0; opacity: 0; }
      60% { opacity: 1; }
      85%, 100% { stroke-dashoffset: -200; opacity: 0; }
    }
  </style>

  <!-- Background -->
  <rect x="5" y="5" width="750" height="310" class="bg"/>

  <!-- Network Section Titles -->
  <text x="140" y="32" class="label-title">เครือข่ายสัญญาณวิทยุ LoRa</text>
  <text x="140" y="47" class="label-sub">(ย่านความถี่สาธารณะ Sub-GHz)</text>
  <line x1="260" y1="20" x2="260" y2="300" stroke="#cbd5e1" stroke-dasharray="4 4" stroke-width="1.5" />
  
  <text x="500" y="32" class="label-title">เครือข่าย TCP/IP / Internet</text>
  <text x="500" y="47" class="label-sub">(โครงข่ายสายเคเบิลหรืออินเทอร์เน็ต)</text>

  <!-- Wired Links -->
  <line x1="280" y1="160" x2="480" y2="160" class="link-wire" />
  <text x="380" y="148" class="label-tech" style="fill: #16a34a;">IP / TCP (MQTT / HTTP)</text>
  
  <line x1="480" y1="160" x2="660" y2="160" class="link-wire" />
  <text x="570" y="148" class="label-tech" style="fill: #16a34a;">IP / WebSockets</text>

  <!-- Wireless Links (ED to GW) -->
  <line x1="80" y1="80" x2="280" y2="160" class="link-wireless" />
  <line x1="80" y1="160" x2="280" y2="160" class="link-wireless" />
  <line x1="80" y1="240" x2="280" y2="160" class="link-wireless" />
  
  <text x="160" y="105" class="label-tech">LoRa RF (AS923)</text>
  <text x="170" y="180" class="label-tech">LoRa RF</text>
  <text x="160" y="225" class="label-tech">LoRa RF</text>

  <!-- Packet Flow Lines (Animations) -->
  <path d="M 80 80 L 280 160" class="packet-lora" />
  <path d="M 80 160 L 280 160" class="packet-lora" style="animation-delay: 0.2s;" />
  <path d="M 80 240 L 280 160" class="packet-lora" style="animation-delay: 0.4s;" />

  <path d="M 280 160 L 480 160" class="packet-ip-gw-ns" />
  <path d="M 480 160 L 660 160" class="packet-ip-ns-as" />

  <!-- Nodes Placement -->
  <!-- End Device 1 -->
  <g transform="translate(35, 55)">
    <rect x="0" y="0" width="90" height="50" class="comp-box" />
    <text x="45" y="24" class="label-sub" style="font-weight: bold;">End Device</text>
    <text x="45" y="38" class="label-sub" style="font-size: 9px;">(เซ็นเซอร์ 1)</text>
    <line x1="45" y1="0" x2="45" y2="-10" stroke="#334155" stroke-width="2"/>
    <circle cx="45" cy="-10" r="3" fill="#334155"/>
  </g>

  <!-- End Device 2 -->
  <g transform="translate(35, 135)">
    <rect x="0" y="0" width="90" height="50" class="comp-box" />
    <text x="45" y="24" class="label-sub" style="font-weight: bold;">End Device</text>
    <text x="45" y="38" class="label-sub" style="font-size: 9px;">(เซ็นเซอร์ 2)</text>
    <line x1="45" y1="0" x2="45" y2="-10" stroke="#334155" stroke-width="2"/>
    <circle cx="45" cy="-10" r="3" fill="#334155"/>
  </g>

  <!-- End Device 3 -->
  <g transform="translate(35, 215)">
    <rect x="0" y="0" width="90" height="50" class="comp-box" />
    <text x="45" y="24" class="label-sub" style="font-weight: bold;">End Device</text>
    <text x="45" y="38" class="label-sub" style="font-size: 9px;">(เซ็นเซอร์ 3)</text>
    <line x1="45" y1="0" x2="45" y2="-10" stroke="#334155" stroke-width="2"/>
    <circle cx="45" cy="-10" r="3" fill="#334155"/>
  </g>

  <!-- Gateway (GW) -->
  <g transform="translate(230, 125)">
    <rect x="0" y="0" width="100" height="70" class="mcu-box" />
    <text x="50" y="28" class="label-title">Gateway (GW)</text>
    <text x="50" y="44" class="label-sub" style="font-weight: bold;">เกตเวย์รับสัญญาณ</text>
    <text x="50" y="58" class="label-sub" style="font-size: 8.5px;">(RF ↔ TCP/IP)</text>
    <line x1="10" y1="0" x2="10" y2="-20" stroke="#7c3aed" stroke-width="2"/>
    <circle cx="10" cy="-20" r="3.5" fill="#7c3aed"/>
  </g>

  <!-- Network Server (NS) -->
  <g transform="translate(430, 125)">
    <rect x="0" y="0" width="100" height="70" class="mcu-box" />
    <text x="50" y="28" class="label-title">Network Server</text>
    <text x="50" y="44" class="label-sub" style="font-weight: bold;">เซิร์ฟเวอร์ควบคุม</text>
    <text x="50" y="58" class="label-sub" style="font-size: 8.5px;">(ถอดรหัส / จัดการ)</text>
  </g>

  <!-- Application Server (AS) -->
  <g transform="translate(610, 125)">
    <rect x="0" y="0" width="110" height="70" class="mcu-box" />
    <text x="55" y="28" class="label-title">App Server (AS)</text>
    <text x="55" y="44" class="label-sub" style="font-weight: bold;">เซิร์ฟเวอร์ปลายทาง</text>
    <text x="55" y="58" class="label-sub" style="font-size: 8.5px;">(แสดงผลแดชบอร์ด)</text>
  </g>
</svg>
</div>

1.  **End Device (อุปกรณ์ผู้ใช้):** ทำการรับส่งสัญญาณด้วยชั้นกายภาพ LoRa เพื่อรายงานตัวเลขไปยังเกตเวย์
2.  **Gateway (เกตเวย์รับสัญญาณ):** อุปกรณ์รับสัญญาณวิทยุ LoRa จากอุปกรณ์ปลายทางทั้งหมดที่อยู่รอบตัว แล้วห่อหุ้มในรูปเฟรมข้อมูล IP ส่งต่อขึ้นสู่อินเทอร์เน็ต ผ่านเครือข่ายมีสายหรือ 4G/5G ไปยังเครื่องแม่ข่าย
3.  **Network Server (แม่ข่ายควบคุมระบบ):** ทำหน้าที่ส่วนการคำนวณถอดรหัส ตรวจสอบความปลอดภัย ขจัดข้อมูลซ้ำซ้อนในกรณีมีเกตเวย์หลายตัวได้รับสัญญาณพร้อมกัน และควบคุมสัญญาณความเร็วเครื่อง (Adaptive Data Rate - ADR) เพื่อช่วยเซฟไฟแบตเตอรี่
4.  **Application Server (เซิร์ฟเวอร์ผู้รับปลายทาง):** รับข้อมูลที่ได้รับการถอดรหัสระดับแพ็กเกจนำข้อมูลไปใช้งานวิเคราะห์หรือแสดงผลบนเว็บแอปพลิเคชัน

### 6.5.3 ประเภทการทำงานของอุปกรณ์ LoRaWAN (Class A / B / C)

มาตรฐานกำหนดคลาสประเภทพฤติกรรมอุปกรณ์ออกเป็น 3 รูปแบบ เพื่อความเหมาะสมกับความจำเป็นของพลังงาน:

*   **Class A (ประหยัดพลังงานสูงสุด):**
    *   อุปกรณ์เซ็นเซอร์จะปิดตัวนิ่งเงียบตลอดเวลา และจะเปิดระบบรับสัญญาณ (Downlink Windows) สั้นๆ 2 ช่องสัญญาณ (RX1 และ RX2) หลังจากตัวมันเพิ่งจัดส่งข้อมูลขึ้นด้านบน (Uplink) เสร็จเรียบร้อยเท่านั้น
    *   *ข้อจำกัด:* เครือข่ายไม่สามารถส่งคำสั่งควบคุมลงหาโหนดทันทีได้ ต้องรอให้โหนดตื่นส่งข้อมูลมาเองก่อนเท่านั้น เหมาะสำหรับเครื่องวัดความชื้นดิน
*   **Class B (เปิดรับสัญญาณตามตารางนัดหมาย):**
    *   อุปกรณ์ปลายทางจะตื่นขึ้นมารับฟังข้อมูล (Downlink) ตามช่องเวลานัดเฉพาะ โดยอิงจังหวะการซิงค์ข้อมูลกับเฟรมคลื่นส่ง Beacon ที่เกตเวย์หลักคอยจ่ายกระจายเสียงออกมาเป็นรอบเวลา
    *   ประหยัดพลังงานปานกลาง และลดเวลาการรอตอบสนอง
*   **Class C (เปิดสแกนรับข้อมูลต่อเนื่อง):**
    *   อุปกรณ์จะทำการเปิดตัวรับวิทยุตลอดเวลา (ยกเว้นแค่เวลาสั้น ๆ ที่ตัวมันเองเป็นฝ่ายส่งข้อมูลออกไป)
    *   ทำให้มีความหน่วงต่ำที่สุดในการเข้าควบคุมจากส่วนกลาง แต่สิ้นเปลืองพลังงานมากที่สุด จึงเหมาะสมเฉพาะกับบอร์ดอุปกรณ์ที่ต่อไฟเลี้ยงหลัก เช่น เสาไฟส่องถนนอัจฉริยะ

### 6.5.4 ข้อจำกัด Duty Cycle และข้อตกลงการแชร์คลื่น (Fair Access Policy)

เนื่องจากเครือข่าย LoRaWAN ทำงานบนความถี่สาธารณะ (Unlicensed band) กฎหมายในหลายพื้นที่และผู้ให้บริการจึงต้องกำหนดกฎระเบียบเพื่อการอยู่ร่วมกัน:

1.  **Duty Cycle Limitation:** เป็นร้อยละของเวลาที่อนุญาตให้อุปกรณ์แต่ละตัวสามารถใช้ส่งคลื่นวิทยุได้ในรอบชั่วโมง ตัวอย่างเช่น กฎหมายย่านความถี่ ISM ของยุโรปและไทยกำหนดควบคุมที่ **1%** ซึ่งหมายความว่า หากบอร์ดส่งแพ็กเกจสัญญาณ LoRa ที่มีระยะเวลาเดินทางในอากาศ (Time-on-Air) นาน 1 วินาที อุปกรณ์จะต้องถูกบังคับหยุดเงียบส่งห้ามวิทยุทำงานเป็นเวลาอย่างน้อย 99 วินาทีต่อจากนั้น
2.  **Fair Access Policy (อย่างเช่นค่าย The Things Network - TTN):**
    *   กำหนดจำกัดเวลาใช้งานของ Uplink รวมของแต่ละโหนดอยู่ที่ไม่เกิน **30 วินาทีต่อวัน**
    *   กำหนดจำกัดการรับส่ง Downlink อยู่ที่ไม่เกิน **10 ข้อความต่อวัน**
    *   ดังนั้น นักพัฒนาจะต้องบีบข้อมูลดิบเซ็นเซอร์ให้สั้น กระชับ และไม่ควรสั่งการอัปเดตข้อมูลขึ้นมาแบบถี่เกินไป

---

## 6.6 เครือข่ายเซลลูลาร์สำหรับ IoT (Cellular IoT)

เครือข่ายเซลลูลาร์สำหรับ IoT (Cellular IoT) คือการพัฒนาโครงสร้างพื้นฐานเดิมของการให้บริการโทรศัพท์เคลื่อนที่ความเร็วสูง (4G และ 5G) เพื่อเปิดสเปกตรัมช่องความถี่สำหรับรองรับความจำเพาะของเซ็นเซอร์และโหนดที่มีจำนวนมหาศาลโดยตรง โดยผู้พัฒนาอุปกรณ์ไม่จำเป็นต้องลงทุนติดตั้งเกตเวย์สถานีวิทยุด้วยตนเอง

### 6.6.1 NB-IoT (Narrowband IoT)

*   **รายละเอียด:** มาตรฐาน 3GPP ทำงานในช่องแบนด์วิดท์ขนาดกว้างเพียง 180 kHz (ซึ่งสามารถยัดแทรกลงไปในช่องว่าง Guard Band ของระบบ LTE ปกติได้พอดี)
*   **ความสามารถการประหยัดพลังงานที่ล้ำลึก:**
    *   **Power Saving Mode (PSM):** อุปกรณ์ยังคงมีสถานะลงทะเบียนออนไลน์เข้าระบบอยู่ แม้จะปิดตัววิทยุหลับลึกเพื่อหลีกเลี่ยงการเสียพลังงาน และสามารถหลับยาวได้นานสูงสุดถึง 413 วัน
    *   **extended Discontinuous Reception (eDRX):** ช่วยให้อุปกรณ์สลับวงจรวิทยุตื่นขึ้นมารอบเวลากระพริบสั้นๆ เพื่อคอยเช็คคำสั่งลงมา (Downlink) โดยไม่ต้องรักษาการเชื่อมต่อและดึงสตรีมไฟเลี้ยงต่อเนื่อง
*   **กลไกความแรงและการเจาะทะลวงของคลื่น (Deep Indoor Coverage):** สามารถปรับเพิ่มค่าความปลอดภัยให้บอร์ดได้สูงสุดถึง +20 dB จากเครือข่ายเซลลูลาร์ทั่วไป จึงเป็นหนึ่งในทางเลือกสำหรับงานอ่านข้อมูลในชั้นใต้ดิน ผนังหนาหนา หรือท่อน้ำประปา

### 6.6.2 LTE-M (eMTC)

*   **รายละเอียด:** มาตรฐานที่ออกแบบมารองรับระดับแบนด์วิดท์ที่ดีกว่าที่ 1.4 MHz ความเร็วรับส่งสูงขึ้นมากประมาณ 1 Mbps
*   **Handover Support (ความต่อเนื่องของการเคลื่อนย้าย):** ต่างจาก NB-IoT ที่หากอุปกรณ์ข้ามเขตเสาสัญญาณการสื่อสารจะขาดตอนและต้องเริ่มกระบวนการลงทะเบียนเครือข่ายใหม่ แต่สำหรับ LTE-M จะทำงานเชื่อมระบบแบบข้ามสถานีฐานแบบไร้รอยต่อ (Handover) เหมือนระบบมือถือปกติ
*   **จุดประสงค์การใช้งาน:** เหมาะกับงานที่ตัวถังเคลื่อนย้ายหนาแน่น เช่น การติดตามพัสดุข้ามเขต (Logistics Tracking) รวมถึงระบบที่มีการติดต่อด้วยคำสั่งเสียงฉุกเฉิน (Voice/VoLTE)

### 6.6.3 5G สำหรับระบบ IoT (mMTC, URLLC, eMBB)

ในโครงสร้าง 5G ได้แบ่งแยกเป้าหมายการสื่อสารออกเป็นสามมุมการพัฒนาที่ตอบโจทย์ไม่เหมือนกัน:

<div style="text-align: center; margin: 20px 0;">
<svg viewBox="0 0 760 330" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Sans Thai', system-ui, sans-serif">
  <title>5G Technology Triangle - 3 Pillars</title>
  <style>
    .bg { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1.5; rx: 12px; }
    .tri-base { fill: #faf5ff; stroke: #cbd5e1; stroke-width: 2.5; stroke-linejoin: round; }
    .tri-flow { fill: none; stroke: #7c3aed; stroke-width: 3.5; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 40 200; stroke-dashoffset: 0; animation: signalRun 4s infinite linear; }
    
    .vertex { fill: #ffffff; stroke: #7c3aed; stroke-width: 2; animation: pulseVertex 2s infinite ease-in-out; }
    
    .label-pillar { font-size: 14px; font-weight: 800; fill: #334155; }
    .label-eng { font-size: 11px; fill: #475569; font-weight: bold; }
    
    .case-box { fill: #ffffff; stroke: #334155; stroke-width: 1.5; rx: 4px; }
    .case-text { font-size: 11.5px; fill: #334155; font-weight: 600; }
    .b-dot { fill: #7c3aed; animation: pulseDot 1.5s infinite; }

    @keyframes signalRun {
      to { stroke-dashoffset: -240; }
    }
    
    @keyframes pulseVertex {
      0%, 100% { r: 6; stroke-width: 2; }
      50% { r: 8.5; stroke-width: 3; }
    }

    @keyframes pulseDot {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 1; }
    }
  </style>

  <rect x="5" y="5" width="750" height="320" class="bg"/>

  <polygon points="380,65 540,235 220,235" class="tri-base" />
  <polygon points="380,65 540,235 220,235" class="tri-flow" />

  <text x="380" y="165" class="label-pillar" style="font-size: 15px;" text-anchor="middle">3 เสาหลักเทคโนโลยี 5G</text>
  <text x="380" y="182" class="label-eng" style="fill: #64748b;" text-anchor="middle">(Three Pillars of 5G)</text>

  <!-- Vertices -->
  <circle cx="380" cy="65" r="7" class="vertex" />
  <circle cx="220" cy="235" r="7" class="vertex" style="animation-delay: 0.6s;" />
  <circle cx="540" cy="235" r="7" class="vertex" style="animation-delay: 1.2s;" />

  <!-- eMBB Section -->
  <g transform="translate(250, 10)">
    <text x="130" y="18" class="label-pillar" style="fill: #7c3aed;" text-anchor="middle">eMBB</text>
    <text x="130" y="32" class="label-eng" style="fill: #7c3aed;" text-anchor="middle">(Enhanced Mobile Broadband)</text>
  </g>
  
  <g transform="translate(480, 20)">
    <rect x="0" y="0" width="250" height="60" class="case-box" />
    <circle cx="15" cy="20" r="4" class="b-dot" />
    <text x="28" y="24" class="case-text">สตรีมวิดีโอ 4K/8K ความหน่วงต่ำ</text>
    <circle cx="15" cy="40" r="4" class="b-dot" style="animation-delay: 0.3s;" />
    <text x="28" y="44" class="case-text">แอปพลิเคชัน VR/AR ในงานอุตสาหกรรม</text>
  </g>

  <!-- URLLC Section -->
  <g transform="translate(10, 245)">
    <text x="100" y="18" class="label-pillar" style="fill: #7c3aed;" text-anchor="middle">URLLC</text>
    <text x="100" y="32" class="label-eng" style="fill: #7c3aed;" text-anchor="middle">(Ultra-Reliable Low Latency)</text>
  </g>
  
  <g transform="translate(10, 160)">
    <rect x="0" y="0" width="230" height="60" class="case-box" />
    <circle cx="15" cy="20" r="4" class="b-dot" style="animation-delay: 0.5s;" />
    <text x="28" y="24" class="case-text">ควบคุมหุ่นยนต์ตอบสนองทันที (&lt;1ms)</text>
    <circle cx="15" cy="40" r="4" class="b-dot" style="animation-delay: 0.8s;" />
    <text x="28" y="44" class="case-text">ระบบนำทางรถยนต์อัจฉริยะ (V2X)</text>
  </g>

  <!-- mMTC Section -->
  <g transform="translate(550, 245)">
    <text x="100" y="18" class="label-pillar" style="fill: #7c3aed;" text-anchor="middle">mMTC</text>
    <text x="100" y="32" class="label-eng" style="fill: #7c3aed;" text-anchor="middle">(massive Machine-Type)</text>
  </g>
  
  <g transform="translate(520, 160)">
    <rect x="0" y="0" width="230" height="60" class="case-box" />
    <circle cx="15" cy="20" r="4" class="b-dot" style="animation-delay: 1.0s;" />
    <text x="28" y="24" class="case-text">เซ็นเซอร์ความหนาแน่นสูงล้านจุด/ตร.กม.</text>
    <circle cx="15" cy="40" r="4" class="b-dot" style="animation-delay: 1.3s;" />
    <text x="28" y="44" class="case-text">NB-IoT &amp; LTE-M (Cellular IoT)</text>
  </g>
</svg>
</div>

1.  **eMBB (Enhanced Mobile Broadband):** การขยายความสามารถแบนด์วิดท์เพื่อส่งข้อมูลขนาดใหญ่ เช่น สตรีมไฟล์วิดีโอความเร็วสูงระดับ 4K/8K หรือเชื่อมโยงภาพสวมใส่เสมือนจริง VR
2.  **mMTC (massive Machine-Type Communications):** ส่วนสนับสนุนเพื่อเชื่อมโยงความหนาแน่นจำนวนโหนดเซ็นเซอร์มหาศาลมากถึง 1 ล้านจุดต่อพื้นที่ตารางกิโลเมตร ซึ่งรวมเอาระบบ NB-IoT และ LTE-M เข้ามาบูรณาการเป็นแกนเทคโนโลยี
3.  **URLLC (Ultra-Reliable Low Latency Communications):** เทคโนโลยีการันตีความหน่วงการรับส่งข้อมูลที่ต่ำกว่า 1 มิลลิวินาที (1 ms) และมีระบบความน่าเชื่อถือสูงมาก เหมาะอย่างยิ่งกับระบบวิศวกรรมความเร็วสูง เช่น การควบรวมการควบคุมหุ่นยนต์ในโรงงานอัตโนมัติ (Factory Automation) หรือการส่งรหัสสำหรับระบบควบคุมการผ่าตัดและเครื่องควบคุมรถยนต์อัจฉริยะ

---

## 6.7 ตารางเปรียบเทียบเชิงวิศวกรรมของ 6 เทคโนโลยีไร้สาย

| เกณฑ์เปรียบเทียบ (Parameters) | Wi-Fi 4 (802.11n) | Bluetooth Low Energy (BLE) | Zigbee (802.15.4) | LoRa / LoRaWAN | NB-IoT | LTE-M (eMTC) |
|---|---|---|---|---|---|---|
| **ความถี่วิทยุหลัก (Frequency)** | 2.4 GHz (หรือ 5 GHz) | 2.4 GHz | 2.4 GHz | Sub-GHz (923 MHz ในไทย) | Licensed LTE Bands (เช่น B8, B28) | Licensed LTE Bands |
| **ระยะทำงานวิทยุ (Typical Range)** | 30 - 100 m | 10 - 100 m | 10 - 100 m (ขยายต่อได้ผ่าน Mesh) | **2 - 15 km** (พื้นที่เปิดโล่ง) | **1 - 15 km** (ขึ้นกับระยะเสาสัญญาณ) | **1 - 10 km** |
| **ความกว้างแบนด์วิดท์ (Bandwidth)** | 20 MHz / 40 MHz | 2 MHz | 2 MHz (ที่ย่าน 2.4 GHz) | 125 kHz / 250 kHz | 180 kHz | 1.4 MHz |
| **อัตราการส่งข้อมูลดิบ (Raw Data Rate)** | สูงมาก (สูงสุด 150-600 Mbps) | ปานกลาง (1 - 2 Mbps) | ต่ำ (250 kbps) | ต่ำมาก (0.3 - 50 kbps) | ต่ำ (~250 kbps) | ปานกลาง (~1 Mbps) |
| **ปริมาณพลังงานไฟฟ้าขณะทำงาน** | สูงมาก (100 - 300 mA) | ต่ำมาก (10 - 15 mA) | ต่ำมาก (15 - 20 mA) | ต่ำที่สุด (10 - 12 mA ช่วงส่ง) | ต่ำมาก (120 mA peak, < 5 $\mu$A sleep) | ปานกลาง (200 mA peak) |
| **โครงร่างเครือข่าย (Topology)** | Star (จุดศูนย์กลาง AP) | Star, Star-of-Stars | **Mesh (เครือข่ายใยแมงมุม)** | Star-of-Stars | Star (ผ่านเสาเซลลูลาร์) | Star (ผ่านเสาเซลลูลาร์) |
| **โครงสร้างพื้นฐานและเจ้าของระบบ** | ผู้ใช้ติดตั้งและเป็นเจ้าของ AP เอง | เชื่อมต่อตรง อุปกรณ์ต่ออุปกรณ์ | ผู้ใช้ติดตั้ง Coordinator/Router เอง | มีทั้งตั้งเกตเวย์เอง และใช้เน็ตเวิร์กผู้ให้บริการ | ต้องใช้ระบบและเสาของผู้ให้บริการเครือข่ายมือถือ | ต้องใช้ระบบและเสาของผู้ให้บริการเครือข่ายมือถือ |
| **ความจุการเชื่อมต่อเครือข่าย** | ~50 - 250 อุปกรณ์ต่อ AP | ขึ้นกับขีดความสามารถสมาร์ตโฟน | **สูงสุด 65,000 อุปกรณ์** | **สูงสุด 10,000 อุปกรณ์ต่อ Gateway** | สูงสุด 50,000 อุปกรณ์ต่อสถานี | สูงสุด 50,000 อุปกรณ์ต่อสถานี |
| **ค่าใช้จ่ายต่อเนื่อง (Operational Cost)** | ไม่มีค่าบริการรายเดือน | ไม่มีค่าบริการรายเดือน | ไม่มีค่าบริการรายเดือน | ไม่มี หากใช้เกตเวย์ตัวเอง / ต่ำ หากใช้เครือข่ายค่าย | มีค่าบริการอินเทอร์เน็ตรายเดือน/รายปีตามซิมการ์ด | มีค่าบริการอินเทอร์เน็ตรายเดือน/รายปีตามซิมการ์ด |

---

## 6.8 กรณีศึกษาทางวิศวกรรมเครื่องกลและอุตสาหกรรม (Engineering Case Studies)

### กรณีศึกษาที่ 1: ระบบวัดการสั่นสะเทือนแบบไร้สายของมอเตอร์ไฟฟ้ากำลังสูง (Predictive Maintenance of High-Power Electric Motors)

*   **บริบทและโจทย์ทางวิศวกรรม:**
    ในโรงงานถลุงเหล็กขนาดใหญ่ มอเตอร์เหนี่ยวนำไฟฟ้า 3 เฟส (Induction Motor) ขนาด 250 kW ที่ใช้ขับเคลื่อนพัดลมระบายอากาศหลักของเตาหลอมเป็นอุปกรณ์วิกฤต (Critical Asset) หากเกิดการเสียหายกะทันหันจะมีมูลค่าความสูญเสียต่อวันหลายล้านบาท ฝ่ายซ่อมบำรุงต้องการติดตั้งระบบตรวจวัดการสั่นสะเทือนแบบไร้สายเพื่อทำการวิเคราะห์หาสัญญาณเตือนเริ่มแรกของความเสียหายของตลับลูกปืน (Bearing Defects) และความไม่สมดุลของเพลา (Shaft Imbalance)
*   **เงื่อนไขและลักษณะทางข้อมูล:**
    การวิเคราะห์อาการสับสะเทือนเชิงลึกจำเป็นต้องเก็บข้อมูลความเร่งจากการสั่นสะเทือน (Vibration Acceleration) ใน 3 แกน ด้วยความถี่ในการสุ่มตรวจจับข้อมูล (Sampling Rate) สูงถึง 5 kHz เพื่อใช้แปลงภาพด้วยกระบวนการ FFT (Fast Fourier Transform) ไปเป็นโดเมนความถี่ (Frequency Domain) ข้อมูลหนึ่งแพ็กเกจการส่งจะประกอบด้วยคะแนนข้อมูลดิบ 4,096 ค่า ซึ่งมีขนาดประมาณ 8 KB ส่งทุก ๆ 10 วินาที เพื่อสร้างกราฟสเปกตรัมวิเคราะห์
*   **การคัดเลือกเทคโนโลยีไร้สายและเหตุผลทางวิศวกรรม:**
    *   **ตัวเลือกที่ได้รับคัดเลือก:** **Wi-Fi 4 (802.11n) ผ่าน ESP32**
    *   *เหตุผล:* เนื่องจากปริมาณข้อมูลต่อชุดที่ต้องส่งมีขนาดใหญ่ (8 KB ทุกๆ 10 วินาที) หากใช้ LoRa หรือ Zigbee จะเกิดปัญหาคอขวดของแบนด์วิดท์อย่างรุนแรงและละเมิดกฎ Duty Cycle นอกจากนี้ในบริเวณพื้นที่ติดตั้งมีเสาสัญญาณ Wi-Fi อุตสาหกรรมสำหรับส่งข้อมูลภายในระบบและมีแหล่งจ่ายไฟเลี้ยงกระแสสลับ 220V เดินสายรออยู่ใกล้ตัวมอเตอร์อยู่แล้ว การใช้ Wi-Fi จึงมีแบนด์วิดท์ที่เพียงพอในการรับส่งข้อมูล และ ESP32 สามารถอ่านข้อมูลความเร่งจากเซ็นเซอร์ดิจิทัล (เช่น ADXL345 หรือ ADXL355 ความละเอียดสูง) ผ่านโปรโตคอล I2C/SPI และอัปโหลดไปยังระบบ SCADA ได้อย่างเสถียร

### กรณีศึกษาที่ 2: ระบบควบคุมและตรวจจับขวดในสายพานลำเลียงคลังสินค้าอัตโนมัติ (Conveyor Belt Automation & Safety Interface)

*   **บริบทและโจทย์ทางวิศวกรรม:**
    คลังสินค้าและกระจายสินค้าอัตโนมัติมีระบบสายพานลำเลียงวัตถุความยาวรวมกว่า 400 เมตร จำเป็นต้องติดตั้งเซ็นเซอร์ตรวจจับตำแหน่งสิ่งของ (Photoelectric Sensors) ตรวจจับแรงตึงของสายพาน และปุ่มกดตัดไฟฉุกเฉิน (E-Stop Switches) รวมทั้งหมด 120 จุดตามแนวสายพานเพื่อความปลอดภัยและการควบคุมจังหวะการเดินของเครื่องจักร
*   **เงื่อนไขและลักษณะทางข้อมูล:**
    สัญญาณเป็นข้อมูลลอจิกขนาดเล็ก (Digital Input/Output - 1 bit หรือ 1 byte) แต่ต้องการความน่าเชื่อถือของการส่งสัญญาณสูงมากเพื่อความปลอดภัยในการป้องกันชีวิตพนักงาน หากมีสัญญาณผิดพลาดหรือสูญหายระหว่างทาง อาจเป็นอันตรายอย่างยิ่งต่อเครื่องจักรและผู้ปฏิบัติงาน
*   **การคัดเลือกเทคโนโลยีไร้สายและเหตุผลทางวิศวกรรม:**
    *   **ตัวเลือกที่ได้รับคัดเลือก:** **Zigbee Mesh (802.15.4)** ร่วมกับโปรโตคอล **Modbus over Zigbee**
    *   *เหตุผล:* โครงสร้างคลังสินค้าเป็นเหล็กขนาดใหญ่และมีชั้นวางสต็อกสินค้าหนาแน่น ซึ่งบล็อกและสะท้อนคลื่นวิทยุความถี่สูงได้ง่าย การตั้งค่าสถาปัตยกรรมแบบ **Mesh (ใยแมงมุม)** ทำให้เซ็นเซอร์แต่ละจุดบนสายพานทำหน้าที่เป็นเราเตอร์คอยโยนต่อข้อมูลวิทยุหากัน ทำให้ครอบคลุมพื้นที่คลังสินค้าทั้งหมดโดยไม่มีจุดบอด และมีระบบเยียวยาเส้นทางส่งหากมีสิ่งกีดขวางวิ่งมาขวางทางชั่วคราว การเดินสายสัญญาณไฟตรงตลอดแนวสายพานใช้เป็นไฟเลี้ยงระบบควบคุมได้ง่าย ทำให้ประหยัดงบค่าเดินสายสัญญาณแบบทองแดงยาวหลายกิโลเมตรและมีความคุ้มค่าเชิงวิศวกรรมสูงสุด

### กรณีศึกษาที่ 3: ระบบตรวจวัดความชื้นดินและควบคุมวาล์วน้ำในฟาร์มปาล์มน้ำมัน 200 เอเคอร์ (Smart Irrigation in 200-Acre Palm Plantation)

*   **บริบทและโจทย์ทางวิศวกรรม:**
    ฟาร์มปาล์มน้ำมันอัจฉริยะพื้นที่ 200 เอเคอร์ (ประมาณ 500 ไร่) ต้องการติดตั้งระบบเกษตรแม่นยำสูงโดยทำการวัดค่าความชื้นดินในจุดต่าง ๆ จำนวน 80 โหนด และติดตั้งจุดเปิด-ปิดวาล์วน้ำควบคุมการจ่ายน้ำให้พืชอีก 20 จุด เพื่อควบคุมอัตราผลผลิตและลดการสูญเสียน้ำป้อนฟาร์ม
*   **เงื่อนไขและลักษณะทางข้อมูล:**
    โหนดเซ็นเซอร์ทั้งหมดต้องใช้ไฟทำงานจากแบตเตอรี่ก้อนเล็กและโซลาร์เซลล์เท่านั้น เนื่องจากเป็นพื้นที่เปิดโล่งกว้างและไม่มีสายส่งไฟฟ้าวิ่งผ่าน ข้อมูลมีขนาดสั้นมาก (ค่าความชื้นและอุณหภูมิส่งเป็นขนาดประมาณ 10 ไบต์) ส่งสัญญานถี่ต่ำทุก ๆ 15 นาที สำหรับการปิด-เปิดวาล์ว ต้องการส่งคำสั่งจากส่วนกลางควบคุมลงไป
*   **การคัดเลือกเทคโนโลยีไร้สายและเหตุผลทางวิศวกรรม:**
    *   **ตัวเลือกที่ได้รับคัดเลือก:** **LoRaWAN (ย่านวิทยุ AS923-1 ประเทศไทย)**
    *   *เหตุผล:* พื้นที่ขนาด 200 เอเคอร์เต็มไปด้วยสวนต้นปาล์มซึ่งเป็นสิ่งกีดขวางที่สะสมความชื้นสูงและบล็อกสัญญาณวิทยุย่านความถี่สูง (Wi-Fi 2.4 GHz จะสูญเสียพลังงานเร็วมากตามกฎ FSPL และถูกดูดกลืนโดยใบไม้ชุ่มน้ำ) คลื่นวิทยุ LoRa ย่าน 923 MHz เป็นคลื่น Sub-GHz ที่มีคุณสมบัติเดินทางทะลุกระเจิงต้นไม้ได้ลึกหลายกิโลเมตร โหนดเซ็นเซอร์ดินทำหน้าที่เป็นอุปกรณ์ **Class A** ซึ่งจะเปิดรับสัญญาณหลังจากส่งค่าขึ้นไปเท่านั้น ช่วยลดการใช้พลังงานจนทำให้ใช้ถ่าน AA สองก้อนได้นานเกิน 5 ปี สำหรับโหนดเปิด-ปิดวาล์วน้ำที่จำเป็นต้องตอบรับคำสั่งอย่างรวดเร็ว จะตั้งเป็นอุปกรณ์ **Class B** เพื่อให้ระบบสั่งการวาล์วน้ำปิดเปิดได้แบบเรียลไทม์ผ่านช่วงสัญญาณ Beacons โดยระบบทั้งหมดใช้เกตเวย์ LoRaWAN เพียงตัวเดียวติดตั้งบนยอดเสาสูงในอาคารสำนักงานของฟาร์ม

---

## 6.9 เกณฑ์และผังในการเลือกเทคโนโลยีวิศวกรรมไร้สาย

### 6.9.1 ปัจจัยสำคัญการพิจารณาทางวิศวกรรม (Key Design Factors)

เมื่อต้องออกแบบสถาปัตยกรรมเครือข่ายสำหรับระบบ IoT ในการทำงานจริง ทางวิศวกรรมจะต้องวิเคราะห์เปรียบเทียบปัจจัยเหล่านี้ร่วมกันเสมอเพื่อป้องกันความล้มเหลวของโครงการ:

1.  **ขีดจำกัดปริมาณข้อมูล (Data Throughput / Bandwidth):** ต้องการส่งข้อมูลภาพ วิดีโอต่อเนื่อง หรือส่งเฉพาะค่าตัวเลขสั้นๆ
2.  **ระยะทางการสื่อสารและการจัดวางสัญญาณ (Operational Range & Environment):** สภาพแวดล้อมมีผนังเหล็กปูน คอนกรีตขวางกั้น หรือเป็นฟาร์มโล่งกว้าง
3.  **แหล่งพลังงานและอายุแบตเตอรี่ (Power Budget):** ใช้ไฟเลี้ยงคงที่ 220V จากโรงงาน หรือต้องเดินเครื่องบนแบตเตอรี่ก้อนจิ๋วในป่าลึก
4.  **ความจุและขยายตัวของระบบโหนด (Scalability):** เครือข่ายต้องการความพร้อมสำหรับการมีอุปกรณ์ลูกข่าย 10 ตัว หรือต้องการเพิ่มเป็น 5,000 ตัวในอนาคต
5.  **ต้นทุนค่าใช้จ่ายโครงการ (CapEx & OpEx):** ค่าใช้จ่ายในการซื้ออุปกรณ์สถานีแม่ข่าย (เกตเวย์) เทียบกับค่าใช้จ่ายรายปีของค่าบริการเน็ตมือถือ (ซิมการ์ด)

### 6.9.2 ผังตัดสินใจเชิงวิศวกรรมอย่างง่าย (Decision Flowchart)

```
                       เริ่มต้นออกแบบระบบไร้สาย
                                  │
                   ┌──────────────┴──────────────┐
                   ▼                             ▼
           ระยะทางไกล (> 1 km)?           ระยะทางใกล้ (< 100 m)?
                   │                             │
         ┌─────────┴─────────┐         ┌─────────┴─────────┐
         ▼                   ▼         ▼                   ▼
    แบนด์วิดท์สูง?      แบนด์วิดท์ต่ำ?   แบนด์วิดท์สูง?      แบนด์วิดท์ต่ำ?
    (> 100 kbps)        (< 10 kbps)    (> 1 Mbps)          (< 250 kbps)
         │                   │         (เช่น กล้อง)            │
         ▼                   ▼         │            ┌──────────┴──────────┐
      Cellular             LoRa        ▼            ▼                     ▼
    (NB-IoT/5G)          /LoRaWAN    Wi-Fi     ต้องการ Mesh?       โหนดต่อตรงมือถือ?
                                               (โหนดจำนวนมาก)       (ประหยัดพลังงาน)
                                                    │                     │
                                                    ▼                     ▼
                                                 Zigbee                  BLE
```

---

## สรุปบทเรียน (Summary)

1.  การสื่อสารไร้สายอาศัย **คลื่นแม่เหล็กไฟฟ้า (Electromagnetic Waves)** โดยระบบ IoT มักใช้งานบนย่านความถี่สาธารณะ **ISM Band** เพื่อลดข้อจำกัดทางใบอนุญาต
2.  สัญญาณจะอ่อนลงตามระยะทางและสิ่งกีดขวางตามกฎ **Inverse Square Law** และสามารถจำลองค่าความสูญเสียเชิงตัวเลขได้ด้วยแบบจำลอง **FSPL** โดยย่าน Sub-GHz จะมีอัตราการสูญเสียน้อยกว่าความถี่สูงอย่าง 2.4 GHz
3.  **Wi-Fi (802.11n/ax)** เหมาะกับระบบแบนด์วิดท์สูง มีไฟเลี้ยงคงที่ โดยบอร์ด ESP32 รองรับ STA, AP และ AP+STA โหมด เพื่อใช้จัดสร้าง Local Web Server ดึงข้อมูลได้โดยตรง
4.  **Bluetooth Low Energy (BLE)** เหมาะสำหรับเครื่องมือแพทย์สวมใส่และระบบตรวจจับอุปกรณ์ใกล้เคียง ทำงานผ่านสถาปัตยกรรมข้อมูลแบบ **GATT** และประหยัดไฟสูง
5.  **Zigbee (802.15.4)** เหมาะสำหรับงานควบคุมอาคารและอุปกรณ์อุตสาหกรรมในพื้นที่ขวางกั้นสูง ผ่านความสามารถสร้างโครงข่ายจัดส่งแบบ **Mesh Network** ที่มีเสถียรภาพเยียวยาตัวเองได้
6.  **LoRa และ LoRaWAN** เหมาะสำหรับการใช้งานครอบคลุมฟาร์มขนาดใหญ่หรือมิเตอร์วัดไฟฟ้านอกตัวเมือง ผ่านสไตล์สัญญาณแบบ **CSS** ซึ่งประหยัดพลังงานสูงมาก
7.  **Cellular IoT (NB-IoT/LTE-M)** เหมาะสำหรับการประยุกต์ใช้ในระดับเมืองอัจฉริยะ (Smart City) โดยใช้อุปกรณ์เชื่อมต่อตรงผ่านเสาสัญญาณผู้ให้บริการที่ทนทานลึกถึงระดับใต้ดิน

---

## แบบฝึกหัดท้ายบท (Exercises)

**ข้อ 1:** ย่านความถี่ ISM Band มีจุดเด่นเชิงนโยบายอย่างไรในการส่งเสริมการพัฒนาอุปกรณ์ IoT และหากนำอุปกรณ์ส่งสัญญาณย่าน ISM 2.4 GHz ไปติดตั้งในอาคารที่มีเครื่องเตาไมโครเวฟหรือระบบ Wi-Fi หนาแน่น จะส่งผลกระทบต่อประสิทธิภาพเชิงคลื่นอย่างไร และสามารถใช้วิธีทางวิศวกรรมใดเพื่อแก้ไข

**ข้อ 2:** จงคำนวณหาค่าความสูญเสียในช่องทางฟรีสเปซ (Free Space Path Loss — FSPL) ในหน่วยเดซิเบล (dB) สำหรับระบบสื่อสารของเซ็นเซอร์ LoRaWAN ที่ความถี่ $923\text{ MHz}$ เมื่อระยะทางห่างระหว่างเครื่องเกตเวย์และโหนดอยู่ที่ $5\text{ km}$ (กำหนดให้กำลังขยายของสายอากาศฝั่งส่งและรับเท่ากับ $0\text{ dBi}$) และอธิบายผลลัพธ์ว่าหากเปลี่ยนความถี่สื่อสารวิทยุเป็น Wi-Fi ย่าน $2.4\text{ GHz}$ ที่ระยะทางเดียวกัน ค่าความสูญเสียจะเพิ่มขึ้นหรือลดลงกี่ dB

**ข้อ 3:** จงอธิบายความแตกต่างเชิงวิศวกรรมระหว่างค่า RSSI และค่า SNR และยกตัวอย่างสถานการณ์ที่อุปกรณ์ IoT มีค่า RSSI ที่สูง (เช่น -45 dBm) แต่ยังคงมีข้อผิดพลาดข้อมูลสูญหายจนถอดรหัสไม่ได้

**ข้อ 4:** ในขั้นตอนการเชื่อมต่อวิทยุ Wi-Fi กระบวนการ 4-Way Handshake มีหน้าที่ปกป้องความปลอดภัยของข้อมูลในระดับใด และเพราะเหตุใดจึงไม่มีการส่งรหัสผ่านจริง (Pre-Shared Key) ผ่านออกไปในอากาศโดยตรง

**ข้อ 5:** จงเขียนแผนภาพสถาปัตยกรรมข้อมูล GATT ของระบบ BLE (BLE GATT Hierarchy) สำหรับอุปกรณ์ "ระบบควบคุมเครื่องจักรวิศวกรรม" ที่มีคุณสมบัติ:
1.  บริการอ่านข้อมูลเซ็นเซอร์อุณหภูมิน้ำมันหล่อลื่น (Lubricant Temp Service)
2.  บริการเขียนข้อมูลสั่งงานมอเตอร์ปั๊มสูบฉีด (Pump Control Service)
ระบุชนิดข้อมูล Properties ของแต่ละ Characteristic พร้อมเขียนหมายเลข UUID ที่เหมาะสมประกอบลงในแผนภาพ

**ข้อ 6:** เครือข่ายแบบ Mesh Network ของระบบ Zigbee มีกลไกทางซอฟต์แวร์อย่างไรในการจัดส่งแพ็กเกจข้อมูลหากเส้นทางผ่านปกติ (Default Route) เกิดความเสียหายกระทันหัน (Self-Healing) และ Coordinator มีบทบาทอย่างไรเมื่อมีอุปกรณ์ลูกข่ายใหม่ต้องการสมัครเข้ามาในเครือข่าย

**ข้อ 7:** จงวิเคราะห์เปรียบเทียบการทำงานของอุปกรณ์ LoRaWAN ในรูปแบบ Class A, Class B และ Class C ในเงื่อนไขความเหมาะสมกับงานควบคุมการเปิด-ปิดหัววาล์วจ่ายน้ำดับเพลิงฉุกเฉินในโรงงานผลิตปิโตรเคมี พร้อมแสดงข้อดีและข้อจำกัดของการเลือกใช้คลาส A ในงานประเภทนี้

**ข้อ 8:** โรงงานอุตสาหกรรมปูนซีเมนต์ต้องการติดตั้งระบบวัดอุณหภูมิและความชื้นของเตาเผาทรงกระบอกหมุนยาว 150 เมตร ซึ่งตั้งอยู่กลางแจ้งและมีพนักงานคอยขับรถตักดินเข้าออกตลอดเวลา จงเลือกเทคโนโลยีไร้สายที่เหมาะสมที่สุดระหว่าง Wi-Fi, BLE และ LoRa พร้อมวิเคราะห์และให้เหตุผลเชิงความคุ้มค่าและความพร้อมใช้งานประกอบการตัดสินใจ

**ข้อ 9:** จงอธิบายความแตกต่างที่สำคัญในเรื่องพฤติกรรมการย้ายเครือข่าย (Mobility Support/Handover) ระหว่างเทคโนโลยี NB-IoT และ LTE-M ในการนำมาประยุกต์ใช้เพื่อติดตามขบวนรถบรรทุกขนส่งตู้สินค้าอัจฉริยะ (Smart Logistics tracking) ไปทั่วประเทศ


---

## หัวข้อเพิ่มเติม: แนวโน้มเทคโนโลยีการสื่อสารไร้สายสำหรับ IoT

### โปรโตคอล Matter
Matter เป็นมาตรฐานการเชื่อมต่อใหม่สำหรับอุปกรณ์สมาร์ทโฮมและ IoT ที่พัฒนาโดยความร่วมมือของบริษัทชั้นนำ (Apple, Google, Amazon ฯลฯ) เพื่อให้อุปกรณ์จากต่างค่ายสามารถสื่อสารและทำงานร่วมกันได้อย่างราบรื่น โดยทำงานอยู่บนพื้นฐานของ IP (Wi-Fi, Thread) และใช้ BLE ในการจับคู่อุปกรณ์

### Wi-Fi 7 (802.11be) และมุมมองสู่ 6G
Wi-Fi 7 ถูกออกแบบมาให้มีความหน่วงต่ำลงอย่างมาก (Ultra-low latency) และรองรับอุปกรณ์จำนวนมหาศาลได้ดีขึ้น เหมาะสำหรับงาน Industrial IoT ที่ต้องการการควบคุมแบบเรียลไทม์ ในขณะเดียวกัน วิสัยทัศน์ของเครือข่าย 6G ก็กำลังพุ่งเป้าไปที่การเชื่อมต่ออุปกรณ์ IoT ระดับไมโครที่ใช้พลังงานต่ำเป็นพิเศษ (Zero-energy devices)
