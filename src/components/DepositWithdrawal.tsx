import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  CreditCard, 
  Smartphone, 
  Building, 
  Wallet, 
  ArrowDownRight, 
  ArrowUpRight, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Shield, 
  TrendingUp,
  Copy,
  QrCode,
  Phone,
  User,
  DollarSign,
  Calendar,
  FileText,
  Send
} from 'lucide-react';
import axios from 'axios';
import FlutterwavePayment from './FlutterwavePayment';

const DepositWithdrawal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdrawal'>('deposit');
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showFlutterwaveModal, setShowFlutterwaveModal] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    accountNumber: '',
    accountName: '',
    bankName: '',
    reason: ''
  });
  

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' XOF';
  };

  const paymentMethods = {
    deposit: [
      {
        id: 'flutterwave',
        name: 'Flutterwave (Recommandé)',
        icon: CreditCard,
        description: 'Cartes, Mobile Money, Virements - Tous en un',
        fees: '0%',
        processingTime: 'Instantané',
        color: 'from-green-500 to-green-600',
        isFlutterwave: true,
        features: [
          'Cartes Visa/Mastercard/Verve',
          'Orange Money, MTN, Moov',
          'Virements bancaires',
          'Codes USSD',
          'Paiement sécurisé PCI DSS'
        ]
      },
      {
        id: 'orange-money',
        name: 'Orange Money Direct',
        icon: Smartphone,
        description: 'Dépôt direct via Orange Money',
        fees: '0%',
        processingTime: 'Instantané',
        color: 'from-orange-500 to-orange-600',
        instructions: [
          'Composez *144# sur votre téléphone',
          'Sélectionnez "Transfert d\'argent"',
          'Entrez le numéro: +225 07 XX XX XX XX',
          'Montant: [MONTANT] XOF',
          'Confirmez avec votre code PIN'
        ]
      },
      {
        id: 'mtn-money',
        name: 'MTN Mobile Money Direct',
        icon: Smartphone,
        description: 'Dépôt direct via MTN Money',
        fees: '0%',
        processingTime: 'Instantané',
        color: 'from-yellow-500 to-yellow-600',
        instructions: [
          'Composez *133# sur votre téléphone',
          'Sélectionnez "Envoi d\'argent"',
          'Entrez le numéro: +225 05 XX XX XX XX',
          'Montant: [MONTANT] XOF',
          'Validez avec votre code secret'
        ]
      },
      {
        id: 'bank-transfer',
        name: 'Virement Bancaire Direct',
        icon: Building,
        description: 'Virement bancaire traditionnel',
        fees: '0%',
        processingTime: '1-3 heures',
        color: 'from-blue-500 to-blue-600',
        instructions: [
          'Banque: SGBCI',
          'Titulaire: SILVO FINANCE SARL',
          'IBAN: CI05 CI05 0000 1234 5678 9012 34',
          'Code SWIFT: SGBCCIDJ',
          'Référence: [VOTRE_ID_CLIENT]'
        ]
      }
    ],
    withdrawal: [
      {
        id: 'orange-money',
        name: 'Orange Money',
        icon: Smartphone,
        description: 'Retrait instantané sur Orange Money',
        fees: '0%',
        processingTime: 'Instantané',
        color: 'from-orange-500 to-orange-600'
      },
      {
        id: 'mtn-money',
        name: 'MTN Mobile Money',
        icon: Smartphone,
        description: 'Retrait rapide sur MTN Money',
        fees: '0%',
        processingTime: 'Instantané',
        color: 'from-yellow-500 to-yellow-600'
      },
      {
        id: 'moov-money',
        name: 'Moov Money',
        icon: Smartphone,
        description: 'Retrait sécurisé sur Moov Money',
        fees: '0%',
        processingTime: 'Instantané',
        color: 'from-blue-500 to-blue-600'
      },
      {
        id: 'bank-transfer',
        name: 'Virement Bancaire',
        icon: Building,
        description: 'Virement sur votre compte bancaire',
        fees: '0%',
        processingTime: '1-3 heures',
        color: 'from-green-500 to-green-600'
      }
    ]
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'amount') {
      setAmount(value);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMethod || !amount || parseInt(amount) < 5000) {
      return;
    }

    const selectedMethodData = paymentMethods[activeTab].find(method => method.id === selectedMethod);
    
    // Si c'est Flutterwave, ouvrir le modal de paiement
    if (selectedMethodData?.isFlutterwave && activeTab === 'deposit') {
      setShowFlutterwaveModal(true);
      return;
    }

    // Sinon, traitement normal
    setIsProcessing(true);
    
    // Simulation de traitement
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Réinitialiser après 5 secondes
      setTimeout(() => {
        setIsSuccess(false);
        setAmount('');
        setSelectedMethod('');
        setFormData({
          phone: '',
          accountNumber: '',
          accountName: '',
          bankName: '',
          reason: ''
        });
      }, 5000);
    }, 3000);
  };

  const handleFlutterwaveSuccess = (response: any) => {
    console.log('Paiement Flutterwave réussi:', response);
    setShowFlutterwaveModal(false);
    setIsSuccess(true);
    
    // Réinitialiser après 5 secondes
    setTimeout(() => {
      setIsSuccess(false);
      setAmount('');
      setSelectedMethod('');
    }, 5000);
  };

  const handleFlutterwaveClose = () => {
    setShowFlutterwaveModal(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const selectedMethodData = paymentMethods[activeTab].find(method => method.id === selectedMethod);

  // Données utilisateur simulées
  const [userBalance, setUserBalance] = useState({
    available: 0,    // Solde disponible
    pending: 0,      // Transactions en attente
    invested: 0      // Montant investi
  });
  useEffect(() => {
    const fetchUserBalance = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:10000/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserBalance(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement du solde:", error);
      }
    };

    fetchUserBalance();
  }, []);

  // Données utilisateur pour Flutterwave
  const userData = {
    name: 'Aminata Traoré',
    email: 'aminata.traore@email.com',
    phone: '+225 07 XX XX XX XX'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/dashboard"
            className="flex items-center space-x-2 mb-8 text-white/80 hover:text-white transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour au Dashboard</span>
          </Link>

          <div className="flex items-center space-x-6 mb-8">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Dépôts & Retraits</h1>
              <p className="text-xl text-white/90">Gérez vos transactions en toute sécurité</p>
            </div>
          </div>

          {/* Soldes */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
              <div className="text-sm text-white/80 mb-1">Solde Disponible</div>
              <div className="text-2xl font-bold">{formatCurrency(userBalance.available)}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
              <div className="text-sm text-white/80 mb-1">En Attente</div>
              <div className="text-2xl font-bold">{formatCurrency(userBalance.pending)}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
              <div className="text-sm text-white/80 mb-1">Investi</div>
              <div className="text-2xl font-bold">{formatCurrency(userBalance.invested)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Onglets */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-xl shadow-lg p-2 flex">
            <button
              onClick={() => setActiveTab('deposit')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'deposit'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <ArrowDownRight className="w-5 h-5" />
              <span>Dépôt</span>
            </button>
            <button
              onClick={() => setActiveTab('withdrawal')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'withdrawal'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <ArrowUpRight className="w-5 h-5" />
              <span>Retrait</span>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Méthodes de paiement */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Choisissez votre méthode de {activeTab === 'deposit' ? 'dépôt' : 'retrait'}
            </h2>
            
            <div className="space-y-6 mb-8">
              {paymentMethods[activeTab].map((method) => (
                <div
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    selectedMethod === method.id
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  } ${method.isFlutterwave ? 'ring-2 ring-green-200' : ''}`}
                >
                  {method.isFlutterwave && (
                    <div className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full inline-block mb-4">
                      🚀 RECOMMANDÉ - Tout-en-un
                    </div>
                  )}
                  
                  <div className="flex items-start space-x-4 mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${method.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <method.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{method.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{method.description}</p>
                      
                      {method.features && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">Méthodes incluses :</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                            {method.features.map((feature, index) => (
                              <div key={index} className="flex items-center text-xs text-gray-600">
                                <CheckCircle className="w-3 h-3 text-green-500 mr-1 flex-shrink-0" />
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Frais:</span>
                      <span className="font-medium text-green-600 ml-2">{method.fees}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Délai:</span>
                      <span className="font-medium text-blue-600 ml-2">{method.processingTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Instructions pour les méthodes directes */}
            {selectedMethod && selectedMethodData && !selectedMethodData.isFlutterwave && activeTab === 'deposit' && selectedMethodData.instructions && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Instructions pour {selectedMethodData.name}
                </h3>
                
                <div className="space-y-3">
                  {selectedMethodData.instructions.map((instruction, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-700">{instruction}</p>
                        {instruction.includes(':') && instruction.includes('+225') && (
                          <button
                            onClick={() => copyToClipboard(instruction.split(': ')[1])}
                            className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1 mt-1"
                          >
                            <Copy className="w-4 h-4" />
                            <span>Copier</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Formulaire */}
          <div className="bg-white rounded-xl shadow-lg p-8 h-fit sticky top-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {activeTab === 'deposit' ? 'Effectuer un Dépôt' : 'Demander un Retrait'}
            </h3>

            {isSuccess ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-green-800 mb-2">
                  {activeTab === 'deposit' ? 'Dépôt Réussi !' : 'Retrait Demandé !'}
                </h4>
                <p className="text-green-600 mb-4">
                  Votre {activeTab === 'deposit' ? 'dépôt' : 'retrait'} de {formatCurrency(parseInt(amount))} a été traité avec succès.
                </p>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-700">
                    {activeTab === 'deposit' 
                      ? 'Votre solde sera mis à jour dans quelques instants.'
                      : 'Vous recevrez une confirmation par SMS et email dans les prochaines minutes.'
                    }
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Montant */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Montant (XOF) *
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={amount}
                    onChange={handleChange}
                    min="5000"
                    step="1000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Minimum 5 000 XOF"
                    required
                  />
                  {amount && parseInt(amount) < 5000 && (
                    <p className="text-red-500 text-sm mt-1">Le montant minimum est de 5 000 XOF</p>
                  )}
                </div>

                {/* Champs spécifiques selon la méthode (sauf Flutterwave) */}
                {selectedMethod && !selectedMethodData?.isFlutterwave && (
                  <>
                    {(selectedMethod.includes('money') || selectedMethod === 'wave') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Numéro de téléphone *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="+225 07 XX XX XX XX"
                          required
                        />
                      </div>
                    )}

                    {selectedMethod === 'bank-transfer' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nom du titulaire du compte *
                          </label>
                          <input
                            type="text"
                            name="accountName"
                            value={formData.accountName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nom complet"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Numéro de compte / IBAN *
                          </label>
                          <input
                            type="text"
                            name="accountNumber"
                            value={formData.accountNumber}
                
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="CI05 CI05 0000 1234 5678 9012 34"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Banque *
                          </label>
                          <select
                            name="bankName"
                            value={formData.bankName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          >
                            <option value="">Sélectionnez votre banque</option>
                            <option value="SGBCI">SGBCI</option>
                            <option value="BICICI">BICICI</option>
                            <option value="BACI">BACI</option>
                            <option value="UBA">UBA</option>
                            <option value="ECOBANK">ECOBANK</option>
                            <option value="NSIA">NSIA BANQUE</option>
                            <option value="CORIS">CORIS BANK</option>
                            <option value="VERSUS">VERSUS BANK</option>
                          </select>
                        </div>
                      </>
                    )}

                    {activeTab === 'withdrawal' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Motif du retrait
                        </label>
                        <textarea
                          name="reason"
                          value={formData.reason}
                          onChange={handleChange}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Optionnel : précisez le motif de votre retrait"
                        />
                      </div>
                    )}
                  </>
                )}

                {/* Résumé */}
                {amount && selectedMethod && parseInt(amount) >= 5000 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Résumé de la transaction</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Montant:</span>
                        <span className="font-medium">{formatCurrency(parseInt(amount))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Méthode:</span>
                        <span className="font-medium">{selectedMethodData?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Frais:</span>
                        <span className="font-medium text-green-600">
                          {selectedMethodData?.fees === '0%' ? 'Gratuit' : selectedMethodData?.fees}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Délai:</span>
                        <span className="font-medium text-blue-600">{selectedMethodData?.processingTime}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-semibold">Total:</span>
                        <span className="font-bold text-lg">{formatCurrency(parseInt(amount))}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bouton de soumission */}
                <button
                  type="submit"
                  disabled={!selectedMethod || !amount || parseInt(amount) < 5000 || isProcessing}
                  className={`w-full py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                    !selectedMethod || !amount || parseInt(amount) < 5000 || isProcessing
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : selectedMethodData?.isFlutterwave
                      ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white hover:scale-105 shadow-lg hover:shadow-xl'
                      : activeTab === 'deposit'
                      ? 'bg-green-600 hover:bg-green-700 text-white hover:scale-105 shadow-lg hover:shadow-xl'
                      : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Traitement...</span>
                    </>
                  ) : selectedMethodData?.isFlutterwave ? (
                    <>
                      <Shield className="w-5 h-5" />
                      <span>Payer avec Flutterwave</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>
                        {activeTab === 'deposit' ? 'Effectuer le Dépôt' : 'Demander le Retrait'}
                      </span>
                    </>
                  )}
                </button>

                {/* Informations importantes */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">Informations importantes :</p>
                      <ul className="space-y-1 text-xs">
                        <li>• Montant minimum : 5 000 XOF</li>
                        <li>• Vérifiez vos informations avant validation</li>
                        <li>• Les transactions sont sécurisées et cryptées</li>
                        <li>• Support disponible 24/7 en cas de problème</li>
                        {selectedMethodData?.isFlutterwave && (
                          <li>• Flutterwave accepte toutes les cartes et mobile money</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Section sécurité */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Sécurité & Garanties</h3>
            <p className="text-gray-600">Vos transactions sont protégées par Flutterwave et les plus hauts standards de sécurité</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Cryptage SSL</h4>
              <p className="text-sm text-gray-600">Toutes les données sont cryptées</p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Conforme PCI DSS</h4>
              <p className="text-sm text-gray-600">Standards de sécurité bancaire</p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Traitement Rapide</h4>
              <p className="text-sm text-gray-600">Transactions instantanées</p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Phone className="w-6 h-6 text-yellow-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Support 24/7</h4>
              <p className="text-sm text-gray-600">Assistance disponible</p>
            </div>
          </div>

          {/* Logo Flutterwave */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-4">Paiements sécurisés par</p>
            <div className="flex items-center justify-center space-x-4">
              <img src="https://flutterwave.com/images/logo/logo-mark/full.svg" alt="Flutterwave" className="h-8" />
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-600">Agrégateur de paiement certifié</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Flutterwave */}
      {showFlutterwaveModal && (
        <FlutterwavePayment
          amount={parseInt(amount)}
          currency="XOF"
          title="Dépôt Silvo Finance"
          description={`Dépôt de ${formatCurrency(parseInt(amount))} sur votre compte Silvo Finance`}
          customerEmail={userData.email}
          customerPhone={userData.phone}
          customerName={userData.name}
          onSuccess={handleFlutterwaveSuccess}
          onClose={handleFlutterwaveClose}
          metadata={{
            user_id: 'user_123',
            transaction_type: 'deposit',
            platform: 'web'
          }}
        />
      )}
    </div>
  );
};

export default DepositWithdrawal;