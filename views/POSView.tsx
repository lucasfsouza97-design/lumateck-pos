
import React, { useState, useRef } from 'react';
import { 
  Search, ShoppingCart, Trash2, Plus, Minus, CreditCard, Banknote, 
  QrCode, Receipt, DollarSign, X, Package, UserPlus, UserCheck, 
  FileCheck, ShieldCheck, Printer, Loader2, CheckCircle2 
} from 'lucide-react';
import { Product, SaleItem, Sale, Customer } from '../types';

interface POSViewProps {
  products: Product[];
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  onCompleteSale: (sale: Sale) => void;
}

const POSView: React.FC<POSViewProps> = ({ products, customers, setCustomers, onCompleteSale }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('Cartão');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [custSearchTerm, setCustSearchTerm] = useState('');
  const [showNewCustForm, setShowNewCustForm] = useState(false);
  const [newCust, setNewCust] = useState<Partial<Customer>>({ name: '', phone: '', cpf: '' });
  
  // Estados de NFC-e
  const [shouldEmitNfce, setShouldEmitNfce] = useState(true);
  const [isEmitting, setIsEmitting] = useState(false);
  const [emitSuccess, setEmitSuccess] = useState(false);
  const [lastNfceKey, setLastNfceKey] = useState('');

  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.code.includes(searchTerm)
  );

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(custSearchTerm.toLowerCase()) || 
    c.cpf.includes(custSearchTerm)
  );

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) {
        alert("Quantidade máxima em estoque atingida!");
        return;
      }
      setCart(cart.map(item => 
        item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1, discount: 0 }]);
    }
    setSearchTerm('');
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.product.id === productId) {
        const productData = products.find(p => p.id === productId);
        const newQty = Math.max(1, item.quantity + delta);
        if (productData && newQty > productData.stock) return item;
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const customer: Customer = {
      ...newCust as Customer,
      id: `c-${Date.now()}`,
      email: '', address: '', birthday: '',
      totalSpent: 0
    };
    setCustomers([customer, ...customers]);
    setSelectedCustomer(customer);
    setShowNewCustForm(false);
    setShowCustomerSearch(false);
    setNewCust({ name: '', phone: '', cpf: '' });
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.product.salePrice * item.quantity), 0);
  const total = subtotal - discount;

  const handleFinishSale = async () => {
    if (shouldEmitNfce) {
      setIsEmitting(true);
      // Simulação de delay de comunicação com SEFAZ
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const key = Array.from({length: 44}, () => Math.floor(Math.random() * 10)).join('');
      setLastNfceKey(key);
      setIsEmitting(false);
      setEmitSuccess(true);
      
      const newSale: Sale = {
        id: `sale-${Date.now()}`,
        date: new Date().toISOString(),
        items: [...cart],
        total: total,
        paymentMethod: [paymentMethod],
        status: 'COMPLETA',
        customerId: selectedCustomer?.id,
        nfceKey: key,
        nfceStatus: 'EMITIDA'
      };
      
      onCompleteSale(newSale);
    } else {
      const newSale: Sale = {
        id: `sale-${Date.now()}`,
        date: new Date().toISOString(),
        items: [...cart],
        total: total,
        paymentMethod: [paymentMethod],
        status: 'COMPLETA',
        customerId: selectedCustomer?.id
      };
      onCompleteSale(newSale);
      resetPOS();
      alert('Venda realizada com sucesso!');
    }
  };

  const resetPOS = () => {
    setCart([]);
    setDiscount(0);
    setShowCheckout(false);
    setSelectedCustomer(null);
    setEmitSuccess(false);
    setIsEmitting(false);
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 animate-fadeIn">
      <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="Nome ou código de barras..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all shadow-sm text-lg"
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map(product => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                disabled={product.stock <= 0}
                className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between hover:shadow-md h-44 group ${
                  product.stock <= 0 ? 'bg-slate-50 opacity-60 cursor-not-allowed border-slate-100' : 'bg-white border-slate-200 hover:border-[#1E3A8A]'
                }`}
              >
                <div>
                  <span className="text-[10px] font-bold text-[#6D28D9] uppercase tracking-widest block mb-1">{product.category}</span>
                  <h4 className="font-bold text-slate-800 line-clamp-2 leading-tight group-hover:text-[#1E3A8A]">{product.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">Ref: {product.code}</p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xl font-black text-slate-900">R$ {product.salePrice.toLocaleString('pt-br')}</span>
                  <div className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${product.stock < 5 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {product.stock} un.
                  </div>
                </div>
              </button>
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
              <Package className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">Nenhum produto encontrado</p>
            </div>
          )}
        </div>
      </div>

      <div className="w-full md:w-[450px] flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="text-[#1E3A8A]" />
              <h3 className="text-lg font-bold text-slate-800">Carrinho</h3>
            </div>
            <span className="bg-[#1E3A8A] text-white px-3 py-1 rounded-full text-xs font-bold">{cart.length}</span>
          </div>

          <div className="relative">
            {selectedCustomer ? (
              <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                <div className="flex items-center gap-3 text-emerald-700">
                  <UserCheck size={18} />
                  <div className="text-left">
                    <p className="text-xs font-black uppercase tracking-tight">{selectedCustomer.name}</p>
                    <p className="text-[10px] opacity-70">{selectedCustomer.cpf}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedCustomer(null)} className="text-emerald-400 hover:text-rose-500"><X size={16} /></button>
              </div>
            ) : (
              <button 
                onClick={() => setShowCustomerSearch(true)}
                className="w-full flex items-center justify-between p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-slate-400 hover:border-blue-300 hover:text-blue-500 transition-all"
              >
                <div className="flex items-center gap-3">
                  <UserPlus size={18} />
                  <span className="text-xs font-bold uppercase">Vincular Cliente</span>
                </div>
                <Plus size={16} />
              </button>
            )}
            
            {showCustomerSearch && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 p-4 max-h-80 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-black text-slate-800 uppercase">Buscar Cliente</h4>
                  <button onClick={() => setShowCustomerSearch(false)}><X size={16}/></button>
                </div>
                <div className="relative mb-4">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Nome ou CPF..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    value={custSearchTerm}
                    onChange={(e) => setCustSearchTerm(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  {filteredCustomers.map(c => (
                    <button 
                      key={c.id} 
                      onClick={() => { setSelectedCustomer(c); setShowCustomerSearch(false); }}
                      className="w-full p-3 text-left hover:bg-blue-50 rounded-xl transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-700">{c.name}</p>
                        <p className="text-[10px] text-slate-400">{c.cpf}</p>
                      </div>
                      <Plus size={14} className="text-slate-300 group-hover:text-blue-500" />
                    </button>
                  ))}
                  <button 
                    onClick={() => setShowNewCustForm(true)}
                    className="w-full p-3 text-center border border-dashed border-blue-200 rounded-xl text-blue-500 text-xs font-bold uppercase hover:bg-blue-50"
                  >
                    + Novo Cliente
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 text-xs line-clamp-1">{item.product.name}</h4>
                <p className="text-[10px] text-slate-500">R$ {item.product.salePrice.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.product.id, -1)} className="w-7 h-7 bg-white rounded border border-slate-200 hover:text-red-500"><Minus size={12} /></button>
                <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.product.id, 1)} className="w-7 h-7 bg-white rounded border border-slate-200 hover:text-[#1E3A8A]"><Plus size={12} /></button>
              </div>
              <div className="text-right min-w-[70px]">
                <p className="font-black text-slate-900 text-sm">R$ {(item.product.salePrice * item.quantity).toFixed(2)}</p>
                <button onClick={() => removeFromCart(item.product.id)} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
          {cart.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-slate-300">
              <ShoppingCart size={40} className="mb-2 opacity-10" />
              <p className="text-xs uppercase font-bold tracking-widest">Carrinho Vazio</p>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-4">
          <div className="flex items-center justify-between text-slate-500 text-xs uppercase font-bold">
            <span>Subtotal</span>
            <span>R$ {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-xs uppercase font-bold">
            <span className="text-slate-500">Desconto</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setDiscount(Math.max(0, discount - 5))} className="text-slate-400 hover:text-red-500"><Minus size={12}/></button>
              <span className="text-red-500">- R$ {discount.toFixed(2)}</span>
              <button onClick={() => setDiscount(discount + 5)} className="text-slate-400 hover:text-emerald-500"><Plus size={12}/></button>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <h2 className="text-xl font-black text-[#1E3A8A]">TOTAL</h2>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">R$ {total.toFixed(2)}</h2>
          </div>
          
          <button 
            disabled={cart.length === 0}
            onClick={() => setShowCheckout(true)}
            className={`w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all shadow-xl ${
              cart.length === 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-[#1E3A8A] to-[#6D28D9] text-white hover:opacity-90 active:scale-95 shadow-blue-100'
            }`}
          >
            FECHAR PEDIDO
            <Receipt size={24} />
          </button>
        </div>
      </div>

      {showNewCustForm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setShowNewCustForm(false)} className="absolute top-6 right-6 text-slate-400"><X size={24} /></button>
            <h2 className="text-2xl font-black text-slate-800 mb-6 uppercase tracking-tight">Novo Cliente</h2>
            <form onSubmit={handleCreateCustomer} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Nome</label>
                <input required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" value={newCust.name} onChange={e => setNewCust({...newCust, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">WhatsApp</label>
                  <input required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" value={newCust.phone} onChange={e => setNewCust({...newCust, phone: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">CPF</label>
                  <input required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" value={newCust.cpf} onChange={e => setNewCust({...newCust, cpf: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="w-full py-5 bg-[#1E3A8A] text-white font-black rounded-2xl shadow-xl mt-4">CADASTRAR E VINCULAR</button>
            </form>
          </div>
        </div>
      )}

      {showCheckout && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 w-full max-w-xl shadow-2xl relative animate-scaleIn">
            {!isEmitting && !emitSuccess && (
              <>
                <button onClick={() => setShowCheckout(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={24} />
                </button>
                <div className="mb-8">
                  <h2 className="text-3xl font-black text-slate-800">Pagamento</h2>
                  <p className="text-slate-500 font-medium">Selecione o método e finalize</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[
                    { name: 'Cartão', icon: CreditCard },
                    { name: 'Dinheiro', icon: Banknote },
                    { name: 'Pix', icon: QrCode },
                    { name: 'Outros', icon: DollarSign },
                  ].map(m => (
                    <button 
                      key={m.name}
                      onClick={() => setPaymentMethod(m.name)}
                      className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${
                        paymentMethod === m.name ? 'border-[#1E3A8A] bg-blue-50 text-[#1E3A8A]' : 'border-slate-100 hover:border-slate-200 text-slate-600'
                      }`}
                    >
                      <m.icon size={24} />
                      <span className="font-black text-sm uppercase">{m.name}</span>
                    </button>
                  ))}
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${shouldEmitNfce ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                      <FileCheck size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase text-slate-800">Emissão de NFC-e</p>
                      <p className="text-[10px] font-bold text-slate-400">Nota Fiscal Eletrônica (Consumidor)</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShouldEmitNfce(!shouldEmitNfce)}
                    className={`w-14 h-8 rounded-full transition-all flex items-center px-1 ${shouldEmitNfce ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'}`}
                  >
                    <div className="w-6 h-6 bg-white rounded-full shadow-md"></div>
                  </button>
                </div>

                <div className="bg-[#1E3A8A] rounded-2xl p-6 text-white mb-8 shadow-inner">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs font-bold uppercase opacity-60">Total a pagar</p>
                      <h2 className="text-4xl font-black tracking-tighter">R$ {total.toFixed(2)}</h2>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold uppercase opacity-60">Cliente</p>
                      <p className="text-lg font-black truncate max-w-[150px]">{selectedCustomer?.name || 'Consumidor Final'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setShowCheckout(false)} className="flex-1 py-4 rounded-xl border-2 border-slate-200 font-bold text-slate-500 hover:bg-slate-50">Voltar</button>
                  <button onClick={handleFinishSale} className="flex-[2] py-4 rounded-xl bg-[#6D28D9] text-white font-black text-lg hover:opacity-90 shadow-xl shadow-purple-100 flex items-center justify-center gap-2">
                    {shouldEmitNfce && <ShieldCheck size={20} />}
                    FINALIZAR VENDA
                  </button>
                </div>
              </>
            )}

            {isEmitting && (
              <div className="py-20 flex flex-col items-center text-center animate-fadeIn">
                <Loader2 size={64} className="text-blue-600 animate-spin mb-6" />
                <h2 className="text-2xl font-black text-slate-800 mb-2">Comunicando com SEFAZ...</h2>
                <p className="text-slate-500 font-medium">Assinando e transmitindo nota fiscal eletrônica.</p>
                <div className="mt-8 w-full max-w-xs bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full animate-[loading_2s_ease-in-out_infinite]"></div>
                </div>
              </div>
            )}

            {emitSuccess && (
              <div className="py-12 flex flex-col items-center text-center animate-scaleIn">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="text-3xl font-black text-slate-800 mb-2">Venda Finalizada!</h2>
                <p className="text-emerald-600 font-bold uppercase text-[10px] tracking-widest mb-8">NFC-e Emitida com Sucesso</p>
                
                <div className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-6 mb-8 text-left">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Chave de Acesso</p>
                  <p className="text-[11px] font-mono font-bold text-slate-600 break-all bg-white p-4 rounded-xl border border-slate-100">
                    {lastNfceKey}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs font-bold text-slate-500">
                    <span>Protocolo: 135240003456789</span>
                    <span>Ambiente: Produção</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 w-full">
                  <button onClick={() => window.print()} className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-black">
                    <Printer size={20} /> IMPRIMIR DANFE (Cupom)
                  </button>
                  <button onClick={resetPOS} className="w-full py-4 bg-white border-2 border-slate-200 text-slate-600 font-black rounded-2xl hover:bg-slate-50">
                    NOVA VENDA
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes loading {
          0% { width: 0; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default POSView;
