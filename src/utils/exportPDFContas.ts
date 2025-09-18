import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import moment from "moment";
import { ContasFilter } from "./typings";

function buildFiltersText(filters: ContasFilter): string {
  if (!filters) return "";

  const result: string[] = [];

  if (filters.statusPagamento) {
    const statusPagamentoText = filters.statusPagamento.map(item => {
      if (item === "pago") {
        return "Pago";
      }
      return "Em Aberto";
    }).join(", ");
    result.push(`Status de Pagamento: ${statusPagamentoText}`);
  }

  if (filters.statusVencimento) {
    result.push(`Status de Vencimento: ${filters.statusVencimento}`);
  }

  if (filters.dataVencimentoInicial || filters.dataVencimentoFinal) {
    result.push(
      `Data de Vencimento: ${filters.dataVencimentoInicial ?? "..."} a ${filters.dataVencimentoFinal ?? "..."
      }`
    );
  }

  if (filters.dataPagamentoInicial || filters.dataPagamentoFinal) {
    result.push(
      `Data de Pagamento: ${filters.dataPagamentoInicial ?? "..."} a ${filters.dataPagamentoFinal ?? "..."
      }`
    );
  }

  if (filters.razaoSocialDescricao?.length) {
    result.push(`Razão Social: ${filters.razaoSocialDescricao.join(", ")}`);
  }

  if (filters.planoContasDescricao?.length) {
    result.push(`Plano de Contas: ${filters.planoContasDescricao.join(", ")}`);
  }

  return result.join(", ");
}

export default function exportPDFContas(
  ref: any,
  filename: string,
  title: string,
  filters?: ContasFilter,
) {
  const input = ref.current!;
  const clone = input.cloneNode(true) as HTMLElement;

  clone.querySelectorAll(".hide-on-pdf").forEach((el) => el.remove());

  const hiddenContainer = document.createElement("div");
  hiddenContainer.style.position = "fixed";
  hiddenContainer.style.top = "-9999px";
  hiddenContainer.style.left = "-9999px";
  hiddenContainer.appendChild(clone);
  document.body.appendChild(hiddenContainer);

  html2canvas(clone, { scale: 2 }).then((canvas) => {
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = 210;
    const pageHeight = 297;
    const sideMargin = 10;
    const topMargin = 30;

    const imgWidth = pageWidth - sideMargin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const imgData = canvas.toDataURL("image/png");

    let heightLeft = imgHeight;
    let position = topMargin;

    pdf.addImage(imgData, "PNG", sideMargin, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - topMargin;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight + topMargin;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", sideMargin, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - topMargin;
    }

    const totalPages = pdf.getNumberOfPages();
    const formattedDate = moment().format("DD/MM/YYYY HH:mm");
    const user = sessionStorage.getItem("clin-cash-user-name") ?? "-";

    const filtersText = filters ? buildFiltersText(filters) : null;

    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);

      if (i === 1) {
        pdf.setFontSize(14);
        pdf.text(title, pageWidth / 2, 15, { align: "center" });

        pdf.setFontSize(10);
        pdf.text(`Usuário: ${user}`, sideMargin, 15);
        pdf.text(`Data: ${formattedDate}`, pageWidth - sideMargin, 15, {
          align: "right",
        });

        if (filtersText) {
          pdf.setFontSize(9);
          pdf.text(filtersText, sideMargin, 25);
        }
      }

      pdf.setLineWidth(0.1);
      pdf.line(sideMargin, 20, pageWidth - sideMargin, 20);

      pdf.setFontSize(8);
      pdf.text(
        `Página ${i} de ${totalPages}`,
        pageWidth - sideMargin,
        pageHeight - 10,
        { align: "right" }
      );
    }

    pdf.save(`${filename}-${moment().format("YYYY-MM-DD")}.pdf`);

    document.body.removeChild(hiddenContainer);
  });
}
