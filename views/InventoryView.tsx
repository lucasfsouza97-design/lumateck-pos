
import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, X, Package } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { Product } from '../types';

interface InventoryProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const InventoryView: React.FC<InventoryProps> = ({ products, setProducts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '', code: '', category: 'Capinhas', costPrice: 0, salePrice: 0, stock: 0, minStock: 2, brand: '', supplier: ''
  });

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.code.includes(searchTerm)
  );

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({ name: '', code: '', category: 'Capinhas', costPrice: 0, salePrice: 0, stock: 0, minStock: 2, brand: '', supplier: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...formData } as Product : p));
    } else {
      const product: Product = {
        ...formData as Product,
        id: `p-${Date.now()}`,
        entryDate: new Date().toISOString().split('T')[0]
      };
      setProducts([product, ...products]);
    }
    setShowModal(false);
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
            placeholder="Buscar produto pelo nome ou SKU..." 
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#1E3A8A] to-[#6D28D9] text-white rounded-xl font-black shadow-lg hover:opacity-90 transition-all"
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
                  <td className="px-8 py-5 font-black text-slate-900 tracking-tighter">R$ {prod.salePrice.toLocaleString('pt-br', { minimumFractionDigits: 2 })}</td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => deleteProduct(prod.id)} className="p-2.5 hover:bg-rose-50 rounded-xl text-rose-400 hover:text-rose-600 transition-colors border border-transparent hover:border-rose-100"><Trash2 size={16} /></button>
                      <button onClick={() => handleOpenEdit(prod)} className="p-2.5 hover:bg-blue-50 rounded-xl text-blue-400 hover:text-blue-600 transition-colors border border-transparent hover:border-blue-100"><Edit size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center text-slate-300">
                      <Package size={48} className="mb-4 opacity-20" />
                      <p className="font-bold uppercase text-xs tracking-widest">Nenhum produto cadastrado</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl relative animate-scaleIn max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"><X size={24} /></button>
            <h2 className="text-3xl font-black text-slate-800 mb-6 tracking-tight">
              {editingProduct ? 'Editar Produto' : 'Novo Produto'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Nome do Produto</label>
                <input required type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Código / SKU</label>
                <input required type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Categoria</label>
                <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Custo (R$)</label>
                <input required type="number" step="0.01" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" value={formData.costPrice} onChange={e => setFormData({...formData, costPrice: parseFloat(e.target.value)})} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Venda (R$)</label>
                <input required type="number" step="0.01" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" value={formData.salePrice} onChange={e => setFormData({...formData, salePrice: parseFloat(e.target.value)})} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Estoque Atual</label>
                <input required type="number" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Estoque Mínimo</label>
                <input required type="number" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" value={formData.minStock} onChange={e => setFormData({...formData, minStock: parseInt(e.target.value)})} />
              </div>
              <div className="col-span-2 flex gap-4 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 font-bold text-slate-500 border border-slate-200 rounded-2xl hover:bg-slate-50">Cancelar</button>
                <button type="submit" className="flex-[2] py-4 bg-[#1E3A8A] text-white font-black rounded-2xl shadow-xl hover:opacity-90">
                  {editingProduct ? 'ATUALIZAR' : 'SALVAR PRODUTO'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryView;
