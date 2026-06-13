// src/components/Common/ImprimirComprovante.tsx
import React from 'react';
import { Printer } from 'lucide-react';
import { Venda } from '../../types';
import { formatCurrency, formatDateTime } from '../../utils/formatadores';

interface ImprimirComprovanteProps {
  venda: Venda;
}

export const ImprimirComprovante: React.FC<ImprimirComprovanteProps> = ({ venda }) => {
  const handlePrint = () => {
    const printContent = document.getElementById('comprovante-content')?.innerHTML;
    const originalContent = document.body.innerHTML;
    
    const printWindow = window.open('', '_blank');
    printWindow?.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Comprovante de Venda - ${venda.numero}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .title {
            font-size: 24px;
            font-weight: bold;
            margin: 0;
          }
          .subtitle {
            color: #666;
            margin-top: 5px;
          }
          .info {
            margin-bottom: 20px;
          }
          .info p {
            margin: 5px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          .total {
            text-align: right;
            font-size: 18px;
            font-weight: bold;
            margin-top: 20px;
            padding-top: 10px;
            border-top: 2px solid #333;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #666;
          }
          @media print {
            button {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        ${printContent}
        <div class="footer">
          <p>Documento emitido em sistema eletrônico</p>
          <p>GiroERP - Sistema de Gestão Empresarial</p>
        </div>
        <script>window.print(); window.close();</script>
      </body>
      </html>
    `);
    printWindow?.document.close();
  };

  return (
    <>
      <div id="comprovante-content" style={{ display: 'none' }}>
        <div className="header">
          <h1 className="title">GiroERP</h1>
          <p className="subtitle">Sistema de Gestão Empresarial</p>
          <p className="subtitle">COMPROVANTE DE VENDA</p>
        </div>
        
        <div className="info">
          <p><strong>Número da Venda:</strong> {venda.numero}</p>
          <p><strong>Data:</strong> {formatDateTime(venda.dataVenda)}</p>
          <p><strong>Cliente:</strong> {venda.cliente?.nome}</p>
          <p><strong>Status:</strong> {venda.status === 'CONCLUIDA' ? 'Concluída' : 'Pendente'}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Preço Unitário</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {venda.itens?.map((item, index) => (
              <tr key={index}>
                <td>{item.produto?.nome}</td>
                <td>{item.quantidade}</td>
                <td>{formatCurrency(item.precoUnitario)}</td>
                <td>{formatCurrency(item.subtotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="total">
          <p>Subtotal: {formatCurrency(venda.subtotal)}</p>
          <p>Desconto: {formatCurrency(venda.desconto || 0)}</p>
          <p>TOTAL: {formatCurrency(venda.total)}</p>
        </div>
      </div>
      
      <button onClick={handlePrint} className="btn-secondary flex items-center gap-2">
        <Printer size={18} />
        Imprimir Comprovante
      </button>
    </>
  );
};