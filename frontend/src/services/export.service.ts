import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export interface ExportData {
  headers: string[];
  rows: any[][];
  title: string;
  filename: string;
}

class ExportService {
  // Exportar para PDF
  exportToPDF(data: ExportData) {
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(18);
    doc.setTextColor(34, 197, 94);
    doc.text(data.title, 14, 20);
    
    // Data
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 30);
    
    // Tabela
    autoTable(doc, {
      head: [data.headers],
      body: data.rows,
      startY: 40,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [34, 197, 94],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });
    
    // Salvar
    doc.save(`${data.filename}.pdf`);
  }
  
  // Exportar para Excel
  exportToExcel(data: ExportData) {
    // Criar worksheet
    const wsData = [
      [data.title],
      [`Gerado em: ${new Date().toLocaleString('pt-BR')}`],
      [],
      data.headers,
      ...data.rows
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Estilizar
    ws['!cols'] = data.headers.map(() => ({ wch: 20 }));
    
    // Criar workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Relatório');
    
    // Exportar
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${data.filename}.xlsx`);
  }
  
  // Exportar dados de vendas
  exportVendas(vendas: any[]) {
    const headers = ['ID', 'Número', 'Cliente', 'Data', 'Total', 'Status'];
    const rows = vendas.map(v => [
      v.id,
      v.numero,
      v.clienteNome || v.cliente?.nome || '-',
      new Date(v.dataVenda).toLocaleString('pt-BR'),
      `R$ ${(v.total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      v.status === 'CONCLUIDA' ? 'Concluída' : v.status === 'CANCELADA' ? 'Cancelada' : 'Pendente'
    ]);
    
    return { headers, rows, title: 'Relatório de Vendas', filename: 'relatorio-vendas' };
  }
  
  // Exportar dados de produtos
  exportProdutos(produtos: any[]) {
    const headers = ['ID', 'Código', 'Nome', 'Categoria', 'Preço', 'Estoque'];
    const rows = produtos.map(p => [
      p.id,
      p.codigo,
      p.nome,
      p.categoria || '-',
      `R$ ${(p.preco || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      p.estoque || 0
    ]);
    
    return { headers, rows, title: 'Relatório de Produtos', filename: 'relatorio-produtos' };
  }
  
  // Exportar dados de clientes
  exportClientes(clientes: any[]) {
    const headers = ['ID', 'Nome', 'CPF/CNPJ', 'Email', 'Telefone', 'Cidade'];
    const rows = clientes.map(c => [
      c.id,
      c.nome,
      c.cpfCnpj || '-',
      c.email || '-',
      c.telefone || '-',
      `${c.cidade || ''}${c.estado ? `/${c.estado}` : ''}`
    ]);
    
    return { headers, rows, title: 'Relatório de Clientes', filename: 'relatorio-clientes' };
  }
}

export default new ExportService();