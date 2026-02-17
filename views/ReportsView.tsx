
import React, { useState } from 'react';
import { 
  FileText, Download, Printer, Filter, Calendar, BarChart as ChartIcon, 
  Layers, TrendingDown, ShoppingBag, Edit, X, Search, Trash2, Plus, Minus, CreditCard, Banknote, QrCode
} from 'lucide-react';
import { Sale, Product, SaleItem } from '../types';

interface ReportsViewProps {
  sales: Sale[];
  products: Product[];
  onUpdateSale: (sale: Sale) => void;
}

const ReportsView: React.FC<ReportsViewProps> = ({ sales, products, onUpdateSale }) => {
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [editItems, setEditItems] = useState<SaleItem[]>([]);
  const [editDiscount, setEditDiscount] = useState(0);
  const [editPaymentMethod, setEditPaymentMethod] = useState<string>('Cartão');
  const [prodSearch, setProdSearch] = useState('');

  const totalRevenue = sales.reduce((acc, s) => acc + s.total, 0);
  const avgTicket = sales.length > 0 ? totalRevenue / sales.length : 0;
  
  const sortedSales = [...sales].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleOpenEdit = (sale: Sale) => {
    setEditingSale(sale);
    setEditItems([...sale.items]);
    setEditDiscount(sale.total - sale.items.reduce((acc, i) => acc + (i.product.salePrice * i.quantity), 0) * -1 || 0);
    // Nota: Lógica de desconto reversa simplificada
    const currentSubtotal = sale.items.reduce((acc, i) => acc + (i.product.salePrice * i.quantity), 0);
    setEditDiscount(currentSubtotal - sale.total);
    setEditPaymentMethod(sale.paymentMethod[0]);
  };

  const updateItemQty = (prodId: string, delta: number) => {
    setEditItems(prev => prev.map(item => {
      if (item.product.id === prodId) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const removeItem = (prodId: string) => {
    setEditItems(prev => prev.filter(i => i.product.id !== prodId));
  };

  const addItemToEdit = (prod: Product) => {
    const existing = editItems.find(i => i.product.id === prod.id);
    if (existing) {
      updateItemQty(prod.id, 1);
    } else {
      setEditItems([...editItems, { product: prod, quantity: 1, discount: 0 }]);
    }
    setProdSearch('');
  };

  const handleSaveEdit = () => {
    if (!editingSale) return;
    const subtotal = editItems.reduce((acc, i) => acc + (i.product.salePrice * i.quantity), 0);
    const updatedSale: Sale = {
      ...editingSale,
      items: editItems,
      total: subtotal - editDiscount,
      paymentMethod: [editPaymentMethod]
    };
    onUpdateSale(updatedSale);
    setEditingSale(null);
  };

  const handleExport = (type: string) => {
    alert(`Exportando relatório de ${type} em PDF... (Módulo de impressão ativado)`);
    window.print();
  };

  const filteredProds = products.filter(p => 
    p.name.toLowerCase().includes(prodSearch.toLowerCase()) || p.code.includes(prodSearch)
  ).slice(0, 5);

  const reports = [
    { title: 'Vendas Detalhadas', desc: 'Histórico completo de transações', icon: FileText, color: 'text-blue-500', type: 'Vendas' },
    { title: 'Desempenho Financeiro', desc: 'Análise de lucro e faturamento', icon: ChartIcon, color: 'text-emerald-500', type: 'Financeiro' },
    { title: 'Giro de Produtos', desc: 'Quais itens mais saíram no mês', icon: Layers, color: 'text-amber-500', type: 'Estoque' },
    { title: 'Saúde de Caixa', desc: 'Entradas vs Saídas consolidadas', icon: TrendingDown, color: 'text-rose-500', type: 'Caixa' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white p-8 rounded-3xl border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Relatórios de Gestão</h2>
          <p className="text-slate-500 mt-1">Dados reais baseados nas operações da Lumateck</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
            <Calendar size={18} className="text-slate-400" />
            <span className="text-sm font-bold text-slate-600">Período: Últimos 30 dias</span>
          </div>
          <button className="p-3 bg-slate-900 text-white rounded-xl hover:bg-black transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reports.map((rep, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col items-start gap-4 group">
            <div className={`w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center ${rep.color} group-hover:scale-110 transition-transform`}>
              <rep.icon size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-black text-slate-800 text-sm uppercase tracking-tight">{rep.title}</h3>
              <p className="text-slate-400 text-[10px] font-bold mt-1 uppercase leading-tight">{rep.desc}</p>
            </div>
            <div className="flex gap-2 w-full mt-2">
              <button onClick={() => handleExport(rep.type)} className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-[10px] font-black uppercase transition-colors">
                <Download size={14} /> PDF
              </button>
              <button onClick={() => window.print()} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
                <Printer size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <h3 className="font-black text-slate-800 tracking-tight">Histórico de Vendas Recentes</h3>
            <span className="text-[10px] font-black text-slate-400 uppercase bg-white px-3 py-1 rounded-full border border-slate-200">{sales.length} PEDIDOS</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="px-6 py-4">Data/Hora</th>
                  <th className="px-6 py-4">Itens</th>
                  <th className="px-6 py-4">Pagamento</th>
                  <th className="px-6 py-4 text-right">Total</th>
                  <th className="px-6 py-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {sortedSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="text-xs font-bold text-slate-700">{new Date(sale.date).toLocaleDateString('pt-br')}</p>
                      <p className="text-[9px] text-slate-400 font-bold">{new Date(sale.date).toLocaleTimeString('pt-br')}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-slate-500">{sale.items.length} {sale.items.length === 1 ? 'item' : 'itens'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase">{sale.paymentMethod[0]}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-black text-slate-900 text-sm">R$ {sale.total.toLocaleString('pt-br', { minimumFractionDigits: 2 })}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <button 
                        onClick={() => handleOpenEdit(sale)}
                        className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                       >
                         <Edit size={16} />
                       </button>
                    </td>
                  </tr>
                ))}
                {sales.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-slate-300">
                      <ShoppingBag size={48} className="mx-auto mb-4 opacity-10" />
                      <p className="font-black text-[10px] uppercase tracking-widest">Nenhuma venda registrada ainda</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-[#1E3A8A] text-white rounded-3xl p-8 flex flex-col shadow-xl">
          <div className="flex-1">
            <h3 className="text-xl font-black mb-6 border-b border-white/10 pb-4">Resumo Executivo</h3>
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-200/60 mb-1">Receita Acumulada</p>
                <h4 className="text-3xl font-black">R$ {totalRevenue.toLocaleString('pt-br', { minimumFractionDigits: 2 })}</h4>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-200/60 mb-1">Ticket Médio</p>
                <h4 className="text-3xl font-black">R$ {avgTicket.toLocaleString('pt-br', { minimumFractionDigits: 2 })}</h4>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-200/60 mb-1">Status do Mês</p>
                <div className="flex items-center gap-2 mt-2">
                   <div className="flex-1 bg-white/10 h-2 rounded-full overflow-hidden">
                     <div className="bg-emerald-400 h-full w-[65%]"></div>
                   </div>
                   <span className="text-xs font-black">65% Meta</span>
                </div>
              </div>
            </div>
          </div>
          <button onClick={() => window.print()} className="mt-8 w-full py-4 bg-white text-[#1E3A8A] font-black rounded-2xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2 shadow-lg">
             <Printer size={18} /> IMPRIMIR FECHAMENTO
          </button>
        </div>
      </div>

      {/* Modal de Edição de Venda */}
      {editingSale && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[40px] p-8 w-full max-w-4xl max-h-[90vh] shadow-2xl relative animate-scaleIn flex flex-col">
            <button onClick={() => setEditingSale(null)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600"><X size={28} /></button>
            
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Editar Venda #{editingSale.id.slice(-4)}</h2>
              <p className="text-slate-400 text-xs font-bold uppercase">Ajuste os itens e finalize a atualização</p>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-hidden">
              <div className="flex flex-col gap-4 overflow-hidden">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Adicionar novos produtos..." 
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm"
                    value={prodSearch}
                    onChange={(e) => setProdSearch(e.target.value)}
                  />
                  {prodSearch && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 p-2">
                      {filteredProds.map(p => (
                        <button key={p.id} onClick={() => addItemToEdit(p)} className="w-full p-3 text-left hover:bg-blue-50 rounded-xl flex items-center justify-between group">
                          <span className="text-xs font-bold text-slate-700">{p.name}</span>
                          <span className="text-[10px] font-black text-blue-600">R$ {p.salePrice.toFixed(2)}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                  {editItems.map((item) => (
                    <div key={item.product.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-800 line-clamp-1">{item.product.name}</p>
                        <p className="text-[10px] text-slate-400">R$ {item.product.salePrice.toFixed(2)} / un</p>
                      </div>
                      <div className="flex items-center gap-3 bg-white px-2 py-1 rounded-xl border border-slate-200">
                        <button onClick={() => updateItemQty(item.product.id, -1)} className="p-1 hover:text-red-500"><Minus size={14}/></button>
                        <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateItemQty(item.product.id, 1)} className="p-1 hover:text-blue-500"><Plus size={14}/></button>
                      </div>
                      <div className="ml-4 text-right min-w-[80px]">
                        <p className="text-xs font-black text-slate-900">R$ {(item.product.salePrice * item.quantity).toFixed(2)}</p>
                        <button onClick={() => removeItem(item.product.id)} className="text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={12}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 p-8 rounded-[32px] flex flex-col justify-between">
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Método de Pagamento</p>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'Cartão', icon: CreditCard },
                        { id: 'Dinheiro', icon: Banknote },
                        { id: 'Pix', icon: QrCode },
                      ].map(m => (
                        <button 
                          key={m.id}
                          onClick={() => setEditPaymentMethod(m.id)}
                          className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                            editPaymentMethod === m.id ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-white text-slate-400'
                          }`}
                        >
                          <m.icon size={18} />
                          <span className="text-[9px] font-black uppercase">{m.id}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-200 space-y-3">
                    <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                      <span>Subtotal</span>
                      <span>R$ {editItems.reduce((acc, i) => acc + (i.product.salePrice * i.quantity), 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold text-rose-500 uppercase">
                      <span>Desconto</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setEditDiscount(Math.max(0, editDiscount - 5))} className="p-1"><Minus size={14}/></button>
                        <span className="font-black">- R$ {editDiscount.toFixed(2)}</span>
                        <button onClick={() => setEditDiscount(editDiscount + 5)} className="p-1"><Plus size={14}/></button>
                      </div>
                    </div>
                    <div className="flex justify-between items-end pt-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Ajustado</p>
                      <h2 className="text-3xl font-black text-[#1E3A8A] tracking-tighter">
                        R$ {(editItems.reduce((acc, i) => acc + (i.product.salePrice * i.quantity), 0) - editDiscount).toFixed(2)}
                      </h2>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button onClick={() => setEditingSale(null)} className="flex-1 py-4 font-bold text-slate-400 hover:bg-white rounded-2xl transition-all">Cancelar</button>
                  <button 
                    disabled={editItems.length === 0}
                    onClick={handleSaveEdit}
                    className="flex-[2] py-4 bg-[#1E3A8A] text-white font-black rounded-2xl shadow-xl hover:opacity-90 disabled:opacity-50"
                  >
                    SALVAR ALTERAÇÕES
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsView;
