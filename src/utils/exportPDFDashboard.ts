import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import moment from "moment";
import { Chart as ChartJS } from "chart.js";

export default async function exportPDFDashboard(
  ref: any,
  filename: string,
  title: string,
  period: string,
) {
  const input = ref?.current;
  if (!input) return;

  const clone = input.cloneNode(true) as HTMLElement;
  clone.querySelectorAll(".hide-on-pdf").forEach(el => el.remove());

  const originalCanvases = Array.from(input.querySelectorAll("canvas"));
  const clonedCanvases = Array.from(clone.querySelectorAll("canvas"));

  for (let i = 0; i < originalCanvases.length; i++) {
    const orig = originalCanvases[i] as HTMLCanvasElement;
    const cloned = clonedCanvases[i] as HTMLCanvasElement | undefined;
    if (!cloned) continue;

    let imgData: string | null = null;
    try {
      if (typeof (ChartJS as any).getChart === "function") {
        const chartInst = (ChartJS as any).getChart(orig);
        if (chartInst && typeof chartInst.toBase64Image === "function") {
          chartInst.update();
          imgData = chartInst.toBase64Image();
        }
      }
    } catch { }

    if (!imgData) {
      try { imgData = orig.toDataURL("image/png"); } catch { imgData = null; }
    }

    if (imgData) {
      const img = document.createElement("img");
      img.src = imgData;
      const rect = cloned.getBoundingClientRect();
      const widthPx = rect.width || cloned.width || 300;
      const heightPx = rect.height || cloned.height || 150;

      img.style.width = `${widthPx}px`;
      img.style.height = `${heightPx}px`;
      img.width = Math.round(widthPx);
      img.height = Math.round(heightPx);

      cloned.parentNode?.replaceChild(img, cloned);
    }
  }

  const hiddenContainer = document.createElement("div");
  hiddenContainer.style.position = "fixed";
  hiddenContainer.style.top = "-9999px";
  hiddenContainer.style.left = "-9999px";
  hiddenContainer.style.width = `${input.getBoundingClientRect().width}px`;
  hiddenContainer.appendChild(clone);
  document.body.appendChild(hiddenContainer);

  try {
    const canvas = await html2canvas(clone, { scale: 3, useCORS: true });

    const pdfWidth = 210;
    const sideMargin = 10;
    const pdfContentWidth = pdfWidth - sideMargin * 2;
    const imgHeight = (canvas.height * pdfContentWidth) / canvas.width;

    const pdf = new jsPDF("p", "mm", [pdfWidth, imgHeight + 40]);

    const imgData = canvas.toDataURL("image/png");

    const formattedDate = moment().format("DD/MM/YYYY HH:mm");
    const user = sessionStorage.getItem("clin-cash-user-name") ?? "-";

    pdf.setFontSize(14);
    pdf.text(title, pdfWidth / 2, 15, { align: "center" });
    pdf.setFontSize(10);
    pdf.text(`Usuário: ${user}`, sideMargin, 15);
    pdf.text(`Data: ${formattedDate}`, pdfWidth - sideMargin, 15, { align: "right" });
    pdf.setLineWidth(0.1);
    pdf.line(sideMargin, 20, pdfWidth - sideMargin, 20);
    pdf.text(`Período: ${period}`, sideMargin, 25);

    pdf.addImage(imgData, "PNG", sideMargin, 30, pdfContentWidth, imgHeight);

    pdf.setFontSize(8);
    pdf.text(`Página 1 de 1`, pdfWidth - sideMargin, imgHeight + 30, { align: "right" });

    pdf.save(`${filename}-${moment().format("YYYY-MM-DD")}.pdf`);
  } finally {
    document.body.removeChild(hiddenContainer);
  }
}
