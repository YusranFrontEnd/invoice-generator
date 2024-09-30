import React, { useState } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import "./index.css";

const InvoiceApp = () => {
  const [date, setDate] = useState("");
  const [invoiceName, setInvoiceName] = useState("");
  const [weight, setWeight] = useState("");
  const [pokokInput, setPokokInput] = useState("");
  const [signature, setSignature] = useState("");
  const [bulan, setBulan] = useState(""); // Tambah state untuk bulan
  const [tahun, setTahun] = useState(""); // Tambah state untuk tahun

  const formatRupiah = (num) => {
    return num.toLocaleString("id-ID", {
      style: "decimal",
      minimumFractionDigits: 0,
    });
  };

  const terbilang = (num) => {
    const satuan = [
      "",
      "Satu",
      "Dua",
      "Tiga",
      "Empat",
      "Lima",
      "Enam",
      "Tujuh",
      "Delapan",
      "Sembilan",
      "Sepuluh",
      "Sebelas",
    ];

    if (num < 12) return satuan[num];
    if (num < 20) return terbilang(num - 10) + " Belas";
    if (num < 100)
      return terbilang(Math.floor(num / 10)) + " Puluh " + terbilang(num % 10);
    if (num < 200) return "Seratus " + terbilang(num - 100);
    if (num < 1000)
      return (
        terbilang(Math.floor(num / 100)) + " Ratus " + terbilang(num % 100)
      );
    if (num < 2000) return "Seribu " + terbilang(num - 1000);
    if (num < 1000000)
      return (
        terbilang(Math.floor(num / 1000)) + " Ribu " + terbilang(num % 1000)
      );
    if (num < 1000000000)
      return (
        terbilang(Math.floor(num / 1000000)) +
        " Juta " +
        terbilang(num % 1000000)
      );
    return (
      terbilang(Math.floor(num / 1000000000)) +
      " Miliar " +
      terbilang(num % 1000000000)
    );
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF();

    const totalWeight = Math.round(parseFloat(weight) * 3); // Membulatkan nilai
    const pokok = Math.round(parseFloat(pokokInput) * 1680 * 354.64); // Membulatkan nilai
    const discount = Math.round(pokok * 0.11); // Membulatkan potongan
    const total = Math.round(pokok + discount); // Membulatkan total

    const formattedWeight = formatRupiah(totalWeight);
    const formattedPokok = formatRupiah(pokok);
    const formattedDiscount = formatRupiah(discount);
    const formattedTotal = formatRupiah(total);

    // Header Nama PT
    doc.setFontSize(16);
    doc.text("PT ANUGERAH HAMZAH PUTRA", 105, 15, { align: "center" });
    doc.setFontSize(12);
    doc.text("AGEN LPG PSO, POROS MAKASSAR-PARE , PANGKEP", 105, 20, {
      align: "center",
    });
    doc.setFontSize(15);
    doc.text("INVOICE", 105, 40, { align: "center" });
    doc.setFontSize(10);
    doc.text("Kepada : PT. PERTAMINA PATRA NIAGA", 15, 50);
    doc.text(
      "Alamat  : Gedung Wisma Tugu II Lt.2, Jl. HR Rasuna Said KAV C7-9 Setiabudi, Jakarta 12920",
      15,
      55
    );

    doc.setFontSize(11);
    doc.text(`Tanggal: ${date}`, 15, 75);
    doc.text(`No. Invoice: ${invoiceName}`, 140, 75);
    doc.setFontSize(11);
    doc.text("H.M YUSUF ", 130, 230);
    doc.setFontSize(10);
    doc.text("Bank  : MANDIRI KCP MAKASSAR SULAWESI ", 15, 160);
    doc.setFontSize(10);
    doc.text("152-00-1037507-5 ", 27, 165);
    doc.setFontSize(10);
    doc.text("PT.ANUGERAH HAMZAH PUTRA ", 27, 170);

    // Tabel Nilai
    doc.autoTable({
      startY: 80,
      head: [["Deskripsi", "Nilai"]],
      body: [
        ["Tagihan Transport Fee Periode " + bulan + " " + tahun, ""], // Baris keterangan
        ["Quantity/Kg", formattedWeight],
        ["Pokok ", formattedPokok],
        ["PPN 11%", formattedDiscount],
        ["Total", formattedTotal],
      ],
    });

    // Menambahkan teks terbilang di bawah tabel
    doc.setFontSize(10);
    doc.text(
      `Terbilang: ${terbilang(pokok)} Rupiah`,
      15,
      doc.autoTable.previous.finalY + 10
    );

    // Tanda tangan
    if (signature) {
      const img = new Image();
      img.src = signature;
      doc.text("Tanda Tangan:", 10, doc.internal.pageSize.height - 50);
      doc.addImage(img, "PNG", 10, doc.internal.pageSize.height - 40, 50, 30);
    }

    doc.save(`${invoiceName}.pdf`);
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setSignature(reader.result); // Menyimpan tanda tangan sebagai base64
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <br />
      <label>
        <p>No.Invoice</p>
        <input
          type="text"
          value={invoiceName}
          onChange={(e) => setInvoiceName(e.target.value)}
        />
      </label>
      <br />

      <label>
        <p>Jumlah Quantity/Kg</p>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="ex: 65000,74000,45780"
        />
      </label>
      <br />
      <label>
        <p>Nilai Pokok</p>
        <input
          type="number"
          value={pokokInput}
          onChange={(e) => setPokokInput(e.target.value)}
          placeholder="Total angkut: 25,109,125"
        />
      </label>

      <label>
        <p>Tanggal</p>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>

      {/* Input untuk bulan dan tahun */}
      <label>
        <p>Bulan/Periode</p>
        <input
          type="text"
          value={bulan}
          onChange={(e) => setBulan(e.target.value)}
        />
      </label>

      <label>
        <p>Tahun</p>
        <input
          type="text"
          value={tahun}
          onChange={(e) => setTahun(e.target.value)}
        />
      </label>
      <br />

      <button onClick={handleGeneratePDF}>Download PDF</button>
    </div>
  );
};

export default InvoiceApp;
