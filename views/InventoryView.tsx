
import React, { useState } from 'react';
import { Plus, Search, Filter, ArrowUpRight, ArrowDownRight, MoreVertical, Edit, Trash2, X } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { Product } from '../types';

interface InventoryProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const InventoryView: React.FC<InventoryProps> = ({ products, setProducts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProd, setNewProd] = useState<Partial<Product>>({
    name: '', code: '', category: 'Capinhas', costPrice: 0, salePrice: 0, stock: 0, minStock: 2, brand: '', supplier: ''
  });

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.code.includes(searchTerm)
  );

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const product: Product = {
      ...newProd as Product,
      id: `p-${Date.now()}`,
      entryDate: new Date().toISOString().split('T')[0]
    };
    setProducts([product, ...products]);
    setShowAddModal(false);
    setNewProd({ name: '', code: '', category: 'Capinhas', costPrice: 0, salePrice: 0, stock: 0, minStock: 2 });
  };

  const deleteProduct = (id: string) => {
    if (confirm("Deseja realmente excluir este produto?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar produto..." 
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#1E3A8A] to-[#6D28D9] text-white rounded-xl font-black shadow-lg shadow-purple-100 hover:scale-[1.02] transition-all"
        >
          <Plus size={20} />
          NOVO PRODUTO
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Produto</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoria</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Estoque</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Preço Venda</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-xl shadow-inner group-hover:bg-white transition-colors">📦</div>
                      <div>
                        <p className="font-black text-slate-800 tracking-tight">{prod.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">SKU: {prod.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-black uppercase tracking-wider">{prod.category}</span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="flex flex-col items-center">
                      <span className={`text-lg font-black ${prod.stock <= prod.minStock ? 'text-rose-500' : 'text-slate-800'}`}>{prod.stock}</span>
                      {prod.stock <= prod.minStock && <span className="text-[8px] font-black text-rose-500 uppercase bg-rose-50 px-1.5 rounded">Alerta</span>}
                    </div>
                  </td>
                  <td className="px-8 py-5 font-black text-slate-900 tracking-tighter">R$ {prod.salePrice.toFixed(2)}</td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => deleteProduct(prod.id)} className="p-2.5 hover:bg-rose-50 rounded-xl text-rose-400 hover:text-rose-600 transition-colors border border-transparent hover:border-rose-100"><Trash2 size={16} /></button>
                      <button className="p-2.5 hover:bg-blue-50 rounded-xl text-blue-400 hover:text-blue-600 transition-colors border border-transparent hover:border-blue-100"><Edit size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl relative animate-scaleIn max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowAddModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"><X size={24} /></button>
            <h2 className="text-3xl font-black text-slate-800 mb-6 tracking-tight">Novo Produto</h2>
            <form onSubmit={handleAddProduct} className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Nome do Produto</label>
                <input required type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" value={newProd.name} onChange={e => setNewProd({...newProd, name: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Código / SKU</label>
                <input required type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" value={newProd.code} onChange={e => setNewProd({...newProd, code: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Categoria</label>
                <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" value={newProd.category} onChange={e => setNewProd({...newProd, category: e.target.value})}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Custo (R$)</label>
                <input required type="number" step="0.01" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" value={newProd.costPrice} onChange={e => setNewProd({...newProd, costPrice: parseFloat(e.target.value)})} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Venda (R$)</label>
                <input required type="number" step="0.01" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" value={newProd.salePrice} onChange={e => setNewProd({...newProd, salePrice: parseFloat(e.target.value)})} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Estoque Inicial</label>
                <input required type="number" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" value={newProd.stock} onChange={e => setNewProd({...newProd, stock: parseInt(e.target.value)})} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Estoque Mínimo</label>
                <input required type="number" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" value={newProd.minStock} onChange={e => setNewProd({...newProd, minStock: parseInt(e.target.value)})} />
              </div>
              <div className="col-span-2 flex gap-4 mt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 font-bold text-slate-500 border border-slate-200 rounded-2xl">Cancelar</button>
                <button type="submit" className="flex-[2] py-4 bg-[#1E3A8A] text-white font-black rounded-2xl shadow-xl shadow-blue-100">SALVAR PRODUTO</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryView;
