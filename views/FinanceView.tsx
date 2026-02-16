
import React, { useState } from 'react';
import { Wallet, ArrowUpCircle, ArrowDownCircle, PieChart, Plus, Trash2, X } from 'lucide-react';
import { Transaction } from '../types';

interface FinanceProps {
  transactions: Transaction[];
  onAddTransaction: (t: Transaction) => void;
}

const FinanceView: React.FC<FinanceProps> = ({ transactions, onAddTransaction }) => {
  const [showModal, setShowModal] = useState(false);
  const [newT, setNewT] = useState<Partial<Transaction>>({
    description: '', amount: 0, type: 'PAGAR', category: 'Outros', status: 'PAGO'
  });

  const balance = transactions.reduce((acc, t) => t.type === 'RECEBER' ? acc + t.amount : acc - t.amount, 0);
  const totalIn = transactions.filter(t => t.type === 'RECEBER').reduce((acc, t) => acc + t.amount, 0);
  const totalOut = transactions.filter(t => t.type === 'PAGAR').reduce((acc, t) => acc + t.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const transaction: Transaction = {
      ...newT as Transaction,
      id: `t-${Date.now()}`,
      dueDate: new Date().toISOString().split('T')[0]
    };
    onAddTransaction(transaction);
    setShowModal(false);
    setNewT({ description: '', amount: 0, type: 'PAGAR', category: 'Outros', status: 'PAGO' });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-[#1E3A8A] to-[#6D28D9] p-8 rounded-3xl text-white shadow-xl">
          <p className="text-sm opacity-80 mb-1 font-bold">Saldo em Caixa</p>
          <h2 className="text-4xl font-black mb-4">R$ {balance.toLocaleString('pt-br')}</h2>
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-black uppercase">
            <ArrowUpCircle size={14} /> Sistema Ativo
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Entradas</p>
          <h2 className="text-3xl font-black text-emerald-500">R$ {totalIn.toLocaleString('pt-br')}</h2>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Saídas</p>
          <h2 className="text-3xl font-black text-rose-500">R$ {totalOut.toLocaleString('pt-br')}</h2>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <h3 className="font-black text-slate-800 tracking-tight">Fluxo de Caixa Mensal</h3>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all"
          >
            <Plus size={16} /> NOVO LANÇAMENTO
          </button>
        </div>
        <div className="overflow-x-auto">
          {transactions.length > 0 ? (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-400 font-black uppercase text-[10px]">
                <tr>
                  <th className="px-8 py-4">Descrição</th>
                  <th className="px-8 py-4">Categoria</th>
                  <th className="px-8 py-4">Data</th>
                  <th className="px-8 py-4 text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {transactions.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${t.type === 'PAGAR' ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'}`}>
                          {t.type === 'PAGAR' ? <ArrowDownCircle size={14} /> : <ArrowUpCircle size={14} />}
                        </div>
                        <span className="font-bold text-slate-700">{t.description}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4 font-medium text-slate-400">{t.category}</td>
                    <td className="px-8 py-4 text-slate-400">{t.dueDate}</td>
                    <td className={`px-8 py-4 text-right font-black ${t.type === 'PAGAR' ? 'text-rose-500' : 'text-emerald-600'}`}>
                      {t.type === 'PAGAR' ? '-' : '+'} R$ {t.amount.toLocaleString('pt-br')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-20 flex flex-col items-center text-slate-300">
              <Wallet size={48} className="mb-4 opacity-20" />
              <p className="font-bold uppercase text-xs tracking-widest">Nenhuma transação registrada hoje</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-lg shadow-2xl relative">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-slate-300 hover:text-slate-600"><X size={24} /></button>
            <h2 className="text-2xl font-black text-slate-800 mb-6 tracking-tight">Novo Lançamento</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Descrição</label>
                <input required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" placeholder="Ex: Pagamento Aluguel" value={newT.description} onChange={e => setNewT({...newT, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Valor (R$)</label>
                  <input required type="number" step="0.01" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" value={newT.amount} onChange={e => setNewT({...newT, amount: parseFloat(e.target.value)})} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Tipo</label>
                  <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" value={newT.type} onChange={e => setNewT({...newT, type: e.target.value as any})}>
                    <option value="PAGAR">Saída (Despesa)</option>
                    <option value="RECEBER">Entrada (Receita)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Categoria</label>
                <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" value={newT.category} onChange={e => setNewT({...newT, category: e.target.value})}>
                  <option value="Aluguel">Aluguel</option>
                  <option value="Energia/Água">Energia/Água</option>
                  <option value="Mercadoria">Compra de Mercadoria</option>
                  <option value="Salários">Salários</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
              <button type="submit" className="w-full py-5 bg-[#1E3A8A] text-white font-black rounded-2xl shadow-xl mt-4">SALVAR LANÇAMENTO</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceView;
