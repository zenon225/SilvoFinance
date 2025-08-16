import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import TermsModal from "./TermsModal";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  TrendingUp,
  CheckCircle,
  Calendar,
  Globe,
  Users,
  AlertCircle,
} from "lucide-react";

interface RegisterProps {
  onSwitchToLogin: (message?: string) => void;
  onClose: () => void;
}

const Register: React.FC<RegisterProps> = ({ onSwitchToLogin, onClose }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showTermsModal, setShowTermsModal] = useState<
    "terms" | "privacy" | null
  >(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    email: "",
    phone: "",
    country: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Récupérer le code de parrainage depuis l'URL
  useEffect(() => {
    const refCode = searchParams.get("ref");
    if (refCode) {
      setFormData((prev) => ({ ...prev, referralCode: refCode }));
    }
  }, [searchParams]);

  const countries = [
    "Côte d'Ivoire",
    "Burkina Faso",
    "Mali",
    "Sénégal",
    "Niger",
    "Guinée",
    "Bénin",
    "Togo",
    "Ghana",
    "Nigeria",
    "Cameroun",
    "Gabon",
    "Congo",
    "RDC",
    "France",
    "Canada",
    "Autre",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Effacer l'erreur quand l'utilisateur tape
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Le prénom est requis";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Le nom est requis";
    }

    if (!formData.birthDate) {
      newErrors.birthDate = "La date de naissance est requise";
    } else {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        newErrors.birthDate = "Vous devez avoir au moins 18 ans";
      }
    }

    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.phone) {
      newErrors.phone = "Le numéro de téléphone est requis";
    } else if (!/^[\+]?[0-9\s\-\(\)]{8,}$/.test(formData.phone)) {
      newErrors.phone = "Format de téléphone invalide";
    }

    if (!formData.country) {
      newErrors.country = "Le pays est requis";
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 8) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 8 caractères";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Veuillez confirmer le mot de passe";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    if (!acceptTerms) {
      newErrors.terms = "Vous devez accepter les conditions d'utilisation";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        "https://backend-silvofinance.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            full_name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            referral_code: formData.referralCode || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Échec de l'inscription");
      }

      // ✅ Inscription réussie
      setSuccessMessage("Votre compte a été créé avec succès !");
      setRegistrationSuccess(true);

      // Réinitialiser le formulaire
      setFormData({
        firstName: "",
        lastName: "",
        birthDate: "",
        email: "",
        phone: "",
        country: "",
        password: "",
        confirmPassword: "",
        referralCode: "",
      });
      setAcceptTerms(false);
    } catch (error: any) {
      console.error("Erreur inscription:", error.message);
      setErrors({ form: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    return strength;
  };

  const getStrengthColor = () => {
    const strength = getPasswordStrength();
    if (strength <= 2) return "bg-red-500";
    if (strength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    const strength = getPasswordStrength();
    if (strength <= 2) return "Faible";
    if (strength <= 3) return "Moyen";
    return "Fort";
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-300 z-10"
        >
          <span className="text-gray-600">×</span>
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Créer un Compte
            </h2>
            <p className="text-gray-600">
              Rejoignez plus de 8 000 investisseurs satisfaits
            </p>
            {formData.referralCode && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-center space-x-2">
                  <Users className="w-5 h-5 text-green-600" />
                  <span className="text-green-800 font-medium">
                    Invité par le code :{" "}
                    <span className="font-bold">{formData.referralCode}</span>
                  </span>
                </div>
                <p className="text-sm text-green-600 mt-1">
                  🎉 Vous bénéficierez d'un bonus de bienvenue !
                </p>
              </div>
            )}
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom et Prénom */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nom *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Votre nom de famille"
                  />
                </div>
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Prénom *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                      errors.firstName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Votre prénom"
                  />
                </div>
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>
            </div>

            {/* Date de naissance */}
            <div>
              <label
                htmlFor="birthDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Date de naissance *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  max={
                    new Date(
                      new Date().setFullYear(new Date().getFullYear() - 18)
                    )
                      .toISOString()
                      .split("T")[0]
                  }
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                    errors.birthDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.birthDate && (
                <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Gmail / Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="votre@gmail.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Pays et Numéro */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Pays *
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                      errors.country ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Sélectionnez votre pays</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.country && (
                  <p className="text-red-500 text-sm mt-1">{errors.country}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Numéro de téléphone *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="+225 07 XX XX XX XX"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Code de parrainage */}
            <div>
              <label
                htmlFor="referralCode"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Code de parrainage (optionnel)
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="referralCode"
                  name="referralCode"
                  value={formData.referralCode}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                  placeholder="Code de votre parrain (ex: AMI2024TRA)"
                />
              </div>
              {formData.referralCode && (
                <p className="text-green-600 text-sm mt-1 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Code de parrainage saisi - Vous recevrez un bonus !
                </p>
              )}
            </div>

            {/* Mot de passe */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mot de passe *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Indicateur de force du mot de passe */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                        style={{
                          width: `${(getPasswordStrength() / 5) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">
                      {getStrengthText()}
                    </span>
                  </div>
                </div>
              )}

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirmation mot de passe */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirmer le mot de passe *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Conditions d'utilisation */}
            <div className="space-y-1">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                />
                <span className="text-sm text-gray-600 leading-relaxed">
                  J'accepte les{" "}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal("terms")}
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    conditions d'utilisation
                  </button>{" "}
                  et la{" "}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal("privacy")}
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    politique de confidentialité
                  </button>
                  . Je confirme avoir plus de 18 ans et comprendre les risques
                  liés aux investissements.
                </span>
              </label>
              {errors.terms && (
                <p className="text-red-500 text-sm pl-8">{errors.terms}</p>
              )}
            </div>

            {/* Bouton d'inscription */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 shadow-lg hover:shadow-xl"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Création du compte...</span>
                </>
              ) : (
                <>
                  <span>Créer mon compte</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {errors.form && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                {errors.form}
              </p>
            </div>
          )}

          {/* Lien vers connexion */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Déjà un compte ?{" "}
              <button
                onClick={onSwitchToLogin}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Se connecter
              </button>
            </p>
          </div>

          {/* Avantages */}
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Pourquoi nous rejoindre ?
            </h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Investissement minimum accessible : 10 000 XOF</li>
              <li>• Rendements de 150% à 750% selon la période</li>
              <li>• Support client dédié 24/7</li>
              <li>• Sécurité bancaire et régulation BCEAO</li>
              {formData.referralCode && (
                <li>• 🎁 Bonus de bienvenue avec votre code de parrainage !</li>
              )}
            </ul>
          </div>

          {/* Sécurité */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800 text-center">
              🔒 Inscription sécurisée SSL • Données cryptées • Conforme RGPD •
              Régulé BCEAO
            </p>
          </div>
        </div>
      </div>

      {showTermsModal && (
        <TermsModal
          type={showTermsModal}
          onClose={() => setShowTermsModal(null)}
        />
      )}
      {/* Popup de confirmation d'inscription */}
      {registrationSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Inscription réussie !
              </h3>
              <p className="text-gray-600 mb-6">{successMessage}</p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setRegistrationSuccess(false);
                    onSwitchToLogin("Vous pouvez maintenant vous connecter.");
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300"
                >
                  Se connecter
                </button>
                <button
                  onClick={() => setRegistrationSuccess(false)}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors duration-300"
                >
                  Continuer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
