import React, { useState, useMemo } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ArrowUpDown, ChevronLeft, ChevronRight, FileDown, FileSpreadsheet } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { ClientData } from "../../types/ClientData.interface";

interface ReportTableProps {
  data: ClientData[];
}

type SortDirection = "asc" | "desc";
type SortConfig = {
  key: keyof ClientData | null;
  direction: SortDirection;
};

export const ReportTable: React.FC<ReportTableProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });

  const formatCurrency = (value: string | number | undefined) => {
    if (value === undefined || value === null) return "-";
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(num)) return "-";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(num);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "-";
    return dateString;
  };

  const handleSort = (key: keyof ClientData) => {
    let direction: SortDirection = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;

      // Handle numeric strings like currency
      if (
        (sortConfig.key === "valor_processo" ||
          sortConfig.key === "valor_honorario" ||
          sortConfig.key === "valor_cliente") &&
        typeof aValue === "string" &&
        typeof bValue === "string"
      ) {
        const aNum = parseFloat(aValue);
        const bNum = parseFloat(bValue);
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum;
        }
      }

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "#",
      "Nome",
      "Cidade",
      "Tribunal",
      "Vara",
      "Entrada",
      "Desfecho",
      "Valor",
      "Status",
    ];
    const tableRows: any[] = [];

    sortedData.forEach((client, index) => {
      const clientData = [
        index + 1,
        client.cliente_nome,
        client.cliente_cidade,
        client.tribunal,
        client.vara,
        client.data_entrada,
        client.desfecho,
        formatCurrency(client.valor_processo),
        client.status_processo,
      ];
      tableRows.push(clientData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.text("Relatório de Clientes", 14, 15);
    doc.save("relatorio_clientes.pdf");
  };

  const exportToCSV = () => {
    const headers = [
      "#",
      "Nome",
      "Cidade",
      "Tribunal",
      "Vara",
      "Entrada",
      "Desfecho",
      "Valor Processo",
      "Status",
    ];

    const csvRows = [headers.join(",")];

    sortedData.forEach((client, index) => {
      const row = [
        index + 1,
        `"${client.cliente_nome ?? ""}"`,
        `"${client.cliente_cidade ?? ""}"`,
        `"${client.tribunal ?? ""}"`,
        `"${client.vara ?? ""}"`,
        `"${formatDate(client.data_entrada) ?? ""}"`,
        `"${client.desfecho ?? ""}"`,
        `"${formatCurrency(client.valor_processo).replace("R$", "").trim()}"`, // Simple number formatting? Or keep currency symbol? User asked for Excel, maybe raw number is better? 
        // Decision: Let's keep visually consistent currency string for now as it's a "report". 
        // Re-reading user request: "formato excell (.csv)". 
        // Standard CSV with quotes handles text.
        `"${client.status_processo ?? ""}"`,
      ];
      csvRows.push(row.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "relatorio_clientes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset page when data changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);


  return (
    <div className="space-y-4 p-3 border-navy-500 border-1 rounded-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Exibir</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => {
              setItemsPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[120px] text-muted-foreground">
              <SelectValue placeholder="50" />
            </SelectTrigger>
            <SelectContent>
              {[50, 100, 150, 200, 500, 1000]
                .filter((opt) => opt < sortedData.length)
                .map((opt) => (
                  <SelectItem key={opt} value={opt.toString()}>
                    {opt}
                  </SelectItem>
                ))
              }
              <SelectItem value={sortedData.length.toString()}>Todos ({sortedData.length})</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground whitespace-nowrap">itens</span>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={exportToCSV}
            variant="outline"
            className="px-3 py-1 h-auto font-normal rounded-md text-sm gap-2 border-input bg-background ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-muted-foreground"
          >
            <FileSpreadsheet className="h-4 w-4 " />
            Exportar CSV
          </Button>
          <Button
            onClick={exportToPDF}
            variant="outline"
            className="px-3 py-1 h-auto font-normal rounded-md text-sm gap-2 border-input bg-background ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-muted-foreground"
          >
            <FileDown className="h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </div>

      <div className="rounded-md border border-border bg-card text-card-foreground shadow-sm">
        <Table>
          <TableCaption>Relatório corresponde às opções selecionadas!</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleSort("cliente_nome")}
              >
                Nome <ArrowUpDown className="ml-2 h-4 w-4 inline-block" />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleSort("cliente_cidade")}
              >
                Cidade <ArrowUpDown className="ml-2 h-4 w-4 inline-block" />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleSort("tribunal")}
              >
                Tribunal <ArrowUpDown className="ml-2 h-4 w-4 inline-block" />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleSort("vara")}
              >
                Vara <ArrowUpDown className="ml-2 h-4 w-4 inline-block" />
              </TableHead>
              <TableHead
                className="text-right cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleSort("data_entrada")}
              >
                Entrada <ArrowUpDown className="ml-2 h-4 w-4 inline-block" />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleSort("desfecho")}
              >
                Desfecho <ArrowUpDown className="ml-2 h-4 w-4 inline-block" />
              </TableHead>
              <TableHead
                className="text-right cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleSort("valor_processo")}
              >
                Valor Processo <ArrowUpDown className="ml-2 h-4 w-4 inline-block" />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleSort("status_processo")}
              >
                Status <ArrowUpDown className="ml-2 h-4 w-4 inline-block" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center h-24 text-muted-foreground">
                  Nenhum dado encontrado para os filtros selecionados.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((client, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium text-muted-foreground">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </TableCell>
                  <TableCell className="font-medium">{client.cliente_nome}</TableCell>
                  <TableCell>{client.cliente_cidade}</TableCell>
                  <TableCell>{client.tribunal}</TableCell>
                  <TableCell>{client.vara}</TableCell>
                  <TableCell className="text-right">{formatDate(client.data_entrada)}</TableCell>
                  <TableCell>{client.desfecho}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(client.valor_processo)}
                  </TableCell>
                  <TableCell>{client.status_processo}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          Exibindo {paginatedData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} até{" "}
          {Math.min(currentPage * itemsPerPage, sortedData.length)} de {sortedData.length} resultados
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 h-auto font-normal rounded-md text-sm border-input bg-background ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 text-muted-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1 h-auto font-normal rounded-md text-sm border-input bg-background ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 text-muted-foreground"
          >
            Próximo
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
