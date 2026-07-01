'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { TEMPLATE_STYLES, getNormalCardSvg } from '@/lib/templates';

// ─── Constants ───────────────────────────────────────────────────────────────
const WORDING_QUOTES: Record<string, string[]> = {
  wedding: [
    "Shree Ganeshaya Namah",
    "Together with their families, you are invited to celebrate the marriage of",
    "Two hearts, one love, one lifetime. Please join us for the wedding ceremony of",
    "Love is patient, love is kind. We request the honor of your presence at the shubh vivah of",
    "Under the canopy of love and blessings, join us to celebrate the wedding of"
  ],
  birthday: [
    "A year older, a year wiser! Come celebrate the birthday party of",
    "Join us for cakes, laughter, and fun as we celebrate the birthday of",
    "Hip Hip Hooray! It is a special day! Celebrate with us the birthday of",
    "Double digits! Join us in celebrating the sweet birthday of"
  ],
  anniversary: [
    "Celebrating years of love, laughter, and happily ever after",
    "Please join us in celebrating the anniversary milestone of",
    "A toast to love, commitment, and memory lane. Celebrate the anniversary of"
  ],
  housewarming: [
    "Shree Ganeshaya Namah. Join us for the auspicious Griha Pravesh of our new home",
    "A house is made of bricks, but a home is made of love. Join us for our Housewarming",
    "New home, new adventures, new memories. We invite you to our house warming ceremony of"
  ]
};

// ─── Types ───────────────────────────────────────────────────────────────────
interface GalleryImage {
  _id: string;
  title: string;
  category: string;
  imageUrl: string;
  price: number;
}

interface CartItem extends GalleryImage {
  qty: number;
}

interface SiteSettings {
  isPremium: boolean;
  upiId: string;
  siteName: string;
  upiName: string;
  defaultNames: string;
  defaultDate: string;
  defaultVenue: string;
  defaultStyle: string;
}

type Category = 'wedding' | 'birthday' | 'anniversary' | 'housewarming' | 'god' | 'frame' | 'ai' | 'festival';

const TABS: { id: Category; label: string; emoji: string }[] = [
  { id: 'wedding', label: 'Wedding', emoji: '💍' },
  { id: 'birthday', label: 'Birthday', emoji: '🎂' },
  { id: 'anniversary', label: 'Anniversary', emoji: '🌹' },
  { id: 'housewarming', label: 'Housewarming', emoji: '🏡' },
  { id: 'festival', label: 'Festival', emoji: '✨' },
  { id: 'god', label: 'God Pic 🔱', emoji: '🔱' },
  { id: 'frame', label: 'Frames 🖼️', emoji: '🖼️' },
  { id: 'ai', label: 'AI Generator', emoji: '🤖' },
];

export default function HomePage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeTab, setActiveTab] = useState<Category>('wedding');
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState({ customerName: '', phone: '', upiRef: '' });
  const [submitting, setSubmitting] = useState(false);

  // Authenticated User states
  const [currentUser, setCurrentUser] = useState<{
    email: string;
    role: string;
    isApproved: boolean;
    aiGenCount?: number;
    isPremiumUser?: boolean;
  } | null>(null);
  const [trialCount, setTrialCount] = useState(0);

  // Auth modal states
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [heroVideoSrc, setHeroVideoSrc] = useState('/uploads/3936463-hd_1920_1080_25fps.mp4');

  // Contact Form states
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitting, setContactSubmitting] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    setContactSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName.trim(),
          email: contactEmail.trim(),
          message: contactMessage.trim(),
          recipient: 'adityadhar.hipl@gmail.com'
        })
      });
      if (!res.ok) throw new Error('Failed to send query');
      toast.success('Query sent successfully! 📩 We will contact you soon.');
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setContactSubmitting(false);
    }
  };

  // QR Payment download modal states
  const [premiumQrModalOpen, setPremiumQrModalOpen] = useState(false);
  const [premiumItemToDownload, setPremiumItemToDownload] = useState<{ type: 'gallery' | 'ai'; data: any } | null>(null);
  const [premiumUpiRef, setPremiumUpiRef] = useState('');
  const [verifyingPremium, setVerifyingPremium] = useState(false);

  // Sharing states
  const [shareCount, setShareCount] = useState(0);

  // Preview Modal state
  const [selectedPreview, setSelectedPreview] = useState<GalleryImage | null>(null);

  // Hero Video state
  const [playingHeroVideo, setPlayingHeroVideo] = useState(false);

  // Text Overlay Customization states (For static uploaded images)
  const [overlayEnabled, setOverlayEnabled] = useState(false);
  const [overlayQuote, setOverlayQuote] = useState('');
  const [overlayNames, setOverlayNames] = useState('Rahul & Priya');
  const [overlayDate, setOverlayDate] = useState('November 26, 2026');
  const [overlayVenue, setOverlayVenue] = useState('Royal Orchid Banquet, New Delhi');
  const [quoteY, setQuoteY] = useState(30); // percentage Y
  const [namesY, setNamesY] = useState(50);
  const [dateY, setDateY] = useState(70);
  const [venueY, setVenueY] = useState(85);
  const [textColor, setTextColor] = useState('#D4AF37'); // Gold default
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1);

  // AI Card Generator state
  const [aiForm, setAiForm] = useState({
    eventType: 'Wedding Invitation',
    names: 'Rahul & Priya',
    date: 'November 26, 2026 at 7:00 PM',
    venue: 'Royal Orchid Banquet, New Delhi',
    theme: 'Luxury Gold & Black',
    selectedStyle: 'royal_gold'
  });
  const [generatedSvg, setGeneratedSvg] = useState<string>('');
  const [generatingAi, setGeneratingAi] = useState(false);

  // Package builder state
  const [showPackageBuilder, setShowPackageBuilder] = useState(false);
  const packageBuilderRef = useRef<HTMLDivElement>(null);

  const [packageItems, setPackageItems] = useState([
    { id: 'catering', label: 'Katering - Puji Catering', price: 45000, checked: true, icon: '🍽️' },
    { id: 'invitation', label: 'Template Desain - Dwivedi\'s Premium', price: 4999, checked: true, icon: '📄' },
    { id: 'dress', label: 'Dress - Sunnah Hijab Syar\'i', price: 15000, checked: true, icon: '👗' },
    { id: 'mc', label: 'MC & Musik - Roni Wedding', price: 20000, checked: true, icon: '🎤' },
  ]);

  const packageTotal = packageItems.reduce((sum, item) => sum + (item.checked ? item.price : 0), 0);

  // Theme Sync effect
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  // Fetch session & trial data on mount
  useEffect(() => {
    // 1. Fetch current session
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (d.authenticated) {
          setCurrentUser({ email: d.email, role: d.role, isApproved: d.isApproved });
        }
      })
      .catch(() => { });

    // 2. Fetch settings
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => {
        if (d.settings) {
          setSettings(d.settings);
          setAiForm(prev => ({
            ...prev,
            names: d.settings.defaultNames || prev.names,
            date: d.settings.defaultDate || prev.date,
            venue: d.settings.defaultVenue || prev.venue,
            selectedStyle: d.settings.defaultStyle || prev.selectedStyle,
          }));
          // Sync default overlay texts too
          setOverlayNames(d.settings.defaultNames || 'Rahul & Priya');
          setOverlayDate(d.settings.defaultDate || 'November 26, 2026');
          setOverlayVenue(d.settings.defaultVenue || 'Royal Orchid Banquet, New Delhi');
        }
      })
      .catch(() => { });

    // 3. Hydrate trial count
    const count = parseInt(localStorage.getItem('dwivedi_trial_count') || '0', 10);
    setTrialCount(count);
  }, []);

  // Hydrate share counts when currentUser logs in
  useEffect(() => {
    if (currentUser) {
      const count = parseInt(localStorage.getItem(`dwivedi_share_count_${currentUser.email}`) || '0', 10);
      setShareCount(count);
    } else {
      setShareCount(0);
    }
  }, [currentUser]);

  // Sync Overlay texts when admin defaults change
  useEffect(() => {
    if (settings) {
      setOverlayNames(settings.defaultNames);
      setOverlayDate(settings.defaultDate);
      setOverlayVenue(settings.defaultVenue);
    }
  }, [settings]);

  // Set default quote when category modal changes
  useEffect(() => {
    if (selectedPreview) {
      const cat = selectedPreview.category.toLowerCase();
      const list = WORDING_QUOTES[cat] || WORDING_QUOTES['wedding'];
      setOverlayQuote(list[0] || '');
    }
  }, [selectedPreview]);

  // Real-time update preview SVG whenever inputs or selected template style changes
  useEffect(() => {
    const normalSvg = getNormalCardSvg(aiForm.selectedStyle, aiForm);
    if (normalSvg) {
      setGeneratedSvg(normalSvg);
    }
  }, [aiForm]);

  // Close package builder on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (packageBuilderRef.current && !packageBuilderRef.current.contains(event.target as Node)) {
        setShowPackageBuilder(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Fetch images on tab change
  const fetchImages = useCallback(async () => {
    if (activeTab === 'ai') return;
    setLoading(true);
    try {
      const res = await fetch(`/api/images?category=${activeTab}`);
      const data = await res.json();
      setImages(data.images || []);
    } catch {
      toast.error('Failed to load images');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  // Auth Submit Action (Login / Signup)
  const handleAuthSubmit = async () => {
    if (!authEmail.trim() || !authPassword.trim()) {
      toast.error('Please enter email and password');
      return;
    }
    if (authTab === 'register' && authPassword !== authConfirmPassword) {
      toast.error('Passwords do not match! Please check again.');
      return;
    }
    setAuthLoading(true);
    const endpoint = authTab === 'login' ? '/api/auth/login' : '/api/auth/register';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail.trim(), password: authPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success(authTab === 'login' ? 'Successfully logged in! 👋' : 'Registered successfully! Pending Admin verification ⏳');
      setCurrentUser({ email: authEmail.trim(), role: data.role || 'user', isApproved: data.isApproved || false });
      setAuthModalOpen(false);
      setAuthEmail('');
      setAuthPassword('');
      setAuthConfirmPassword('');
      setShowPassword(false);
      setShowConfirmPassword(false);
    } catch (err: any) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  // Sign out
  const handleUserLogout = async () => {
    try {
      await fetch('/api/auth/login', { method: 'DELETE' });
      setCurrentUser(null);
      toast.success('Logged out successfully');
    } catch {
      toast.error('Failed to log out');
    }
  };

  // Check limits & session status before generation
  const verifyLimitAndPermissions = (): boolean => {
    // 1. Admins bypass limit checks
    if (currentUser && currentUser.role === 'admin') {
      return true;
    }

    // 2. Guest User limit: Max 2 attempts
    if (!currentUser) {
      const guestCount = parseInt(localStorage.getItem('dwivedi_ai_gen_count_guest') || '0', 10);
      if (guestCount >= 2) {
        toast.error('Free trial limit (2 AI generations) exhausted! Please register/login to continue.', { duration: 6000 });
        setAuthTab('register');
        setAuthModalOpen(true);
        return false;
      }
      return true;
    }

    // 3. User account approval check
    if (!currentUser.isApproved) {
      toast.error('Account is pending approval by the Admin! ⏳ Please wait for activation.', { duration: 6000 });
      return false;
    }

    // 4. Premium Paid User limit: Max 10 attempts
    if (currentUser.isPremiumUser) {
      const count = currentUser.aiGenCount || 0;
      if (count >= 10) {
        toast.error('Premium account AI limit (10 generations) reached! Contact support to request more.', { duration: 6000 });
        return false;
      }
      return true;
    }

    // 5. Standard Registered User limit: Max 4 attempts
    const count = currentUser.aiGenCount || 0;
    if (count >= 4) {
      toast.error('Standard account AI limit (4 generations) reached! Upgrade to paid/premium for 10 generations.', { duration: 6000 });
      return false;
    }

    return true;
  };

  // Grok AI Card Generator
  const generateAiCard = async () => {
    if (!verifyLimitAndPermissions()) return;

    setGeneratingAi(true);
    setGeneratedSvg('');
    const toastId = toast.loading('Grok is designing your custom card...', { position: 'bottom-center' });
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aiForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Increment counts on client state
      if (!currentUser) {
        const nextGuest = parseInt(localStorage.getItem('dwivedi_ai_gen_count_guest') || '0', 10) + 1;
        localStorage.setItem('dwivedi_ai_gen_count_guest', nextGuest.toString());
        toast(`Free Guest Trial: Attempt ${nextGuest} of 2`, { icon: '✨' });
      } else {
        const currentCount = currentUser.aiGenCount || 0;
        setCurrentUser(prev => prev ? { ...prev, aiGenCount: currentCount + 1 } : null);
        const limit = currentUser.isPremiumUser ? 10 : 4;
        toast(`Account AI Generation: Attempt ${currentCount + 1} of ${limit}`, { icon: '✨' });
      }

      setGeneratedSvg(data.svg);
      toast.success('Your premium card is ready! 🎨', { id: toastId });
    } catch (err: any) {
      toast.error(err.message || 'AI Design failed. Please try again.', { id: toastId });
    } finally {
      setGeneratingAi(false);
    }
  };

  // Generate Normal Card instantly (Local template fallback)
  const generateNormalCard = () => {
    if (!verifyLimitAndPermissions()) return;

    const normalSvg = getNormalCardSvg(aiForm.selectedStyle, aiForm);
    if (!normalSvg) {
      toast.error('Template is invalid');
      return;
    }
    setGeneratedSvg(normalSvg);
    toast.success('Instant template card generated successfully! 🎨');
  };

  // Cart helpers
  const addToCart = (img: GalleryImage) => {
    setCart(prev => {
      const exists = prev.find(i => i._id === img._id);
      if (exists) {
        toast('Already in cart!', { icon: '🛒' });
        return prev;
      }
      toast.success('Added to cart!');
      return [...prev, { ...img, qty: 1 }];
    });
  };

  const addPackageToCart = () => {
    packageItems.forEach(item => {
      if (item.checked) {
        addToCart({
          _id: item.id,
          title: item.label,
          category: 'wedding',
          imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=200',
          price: item.price
        });
      }
    });
    setShowPackageBuilder(false);
    toast.success('Package added to cart! 🛒');
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i._id !== id));
    toast('Removed from cart', { icon: '🗑️' });
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  // Sharing invitation cards limit logic (without paid maximum 2 share)
  const handleShareCard = async (img: GalleryImage) => {
    if (!currentUser) {
      toast.error('Please sign in (login/register) first to share invitation cards.');
      setAuthTab('login');
      setAuthModalOpen(true);
      return;
    }

    // Admins get unlimited sharing
    const currentCount = parseInt(localStorage.getItem(`dwivedi_share_count_${currentUser.email}`) || '0', 10);
    if (currentUser.role !== 'admin' && currentCount >= 2) {
      toast.error('Free share limit (maximum 2 times) reached! Please place an order or contact the admin.', { duration: 5000 });
      return;
    }

    // Increment share counter
    const nextCount = currentCount + 1;
    localStorage.setItem(`dwivedi_share_count_${currentUser.email}`, nextCount.toString());
    setShareCount(nextCount);

    const shareUrl = `${window.location.origin}?previewId=${img._id}`;
    const shareData = {
      title: img.title,
      text: `Checkout this premium invitation card from Dwivedi's Enterprise: ${img.title}`,
      url: shareUrl
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success(`Successfully shared! (Share: ${nextCount}/2) 🔗`);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success(`Invitation link copied to clipboard! (Share: ${nextCount}/2) 🔗`);
      }
    } catch {
      // Fallback copy
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success(`Invitation link copied! (Share: ${nextCount}/2) 🔗`);
      } catch {
        toast.error('Failed to share the link');
      }
    }
  };

  // Trigger download after payment approval
  const executePDFDownload = (img: GalleryImage) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Popup blocked!');
      return;
    }

    const overlayStyles = overlayEnabled ? `
      <div style="position: absolute; top: ${quoteY}%; left: 50%; transform: translate(-50%, -50%); color: ${textColor}; font-size: ${14 * fontSizeMultiplier}px; font-weight: 500; font-family: 'Outfit', sans-serif; text-align: center; width: 90%; font-style: italic;">
        ${overlayQuote.toUpperCase()}
      </div>
      <div style="position: absolute; top: ${namesY}%; left: 50%; transform: translate(-50%, -50%); color: ${textColor}; font-size: ${28 * fontSizeMultiplier}px; font-weight: 800; font-family: 'Outfit', sans-serif; text-align: center; width: 90%; letter-spacing: 1px;">
        ${overlayNames.toUpperCase()}
      </div>
      <div style="position: absolute; top: ${dateY}%; left: 50%; transform: translate(-50%, -50%); color: #ffffffd0; font-size: ${16 * fontSizeMultiplier}px; font-weight: 600; font-family: 'Outfit', sans-serif; text-align: center; width: 90%; letter-spacing: 1px;">
        ${overlayDate.toUpperCase()}
      </div>
      <div style="position: absolute; top: ${venueY}%; left: 50%; transform: translate(-50%, -50%); color: #ffffffb8; font-size: ${15 * fontSizeMultiplier}px; font-weight: 500; font-family: 'Outfit', sans-serif; text-align: center; width: 90%;">
        ${overlayVenue.toUpperCase()}
      </div>
    ` : '';

    printWindow.document.write(`
      <html>
        <head>
          <title>${img.title} - Dwivedi Premium Print</title>
          <style>
            body { margin: 0; padding: 0; background-color: #0b0c10; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
            .container { position: relative; width: 100vw; max-width: 800px; aspect-ratio: 3/4; overflow: hidden; }
            img { width: 100%; height: 100%; object-fit: contain; background: #000; }
            @media print { body { background: transparent; } .container { width: 100vw; height: 100vh; } }
          </style>
        </head>
        <body>
          <div class="container">
            <img src="${img.imageUrl}" alt="${img.title}" />
            ${overlayStyles}
            <div style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); font-family: 'Outfit', sans-serif; font-size: 13px; color: rgba(255,255,255,0.45); letter-spacing: 3px; font-weight: 600; text-transform: uppercase; z-index: 100;">
              Aditya Dwivedi
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const executeAiPDFDownload = (svgContent: string) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Popup blocked!');
      return;
    }

    // Inject watermark text inside SVG content before printing
    const watermarkedSvg = svgContent.replace(
      '</svg>',
      '<text x="50%" y="1165" text-anchor="middle" fill="#ffffff" fill-opacity="0.45" font-family="\'Outfit\', sans-serif" font-size="12" font-weight="700" letter-spacing="4">ADITYA DWIVEDI</text></svg>'
    );

    printWindow.document.write(`
      <html>
        <head>
          <title>${aiForm.names} - Invitation Card</title>
          <style>
            body { margin: 0; background: #000; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
            svg { width: auto; height: 95vh; max-width: 100%; }
            @media print { body { background: transparent; } svg { width: 100vw; height: 100vh; } }
          </style>
        </head>
        <body>
          ${watermarkedSvg}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // PDF Downloader wrapper (handles authentication and premium check)
  const downloadAsPDF = async (img: GalleryImage) => {
    if (!currentUser) {
      toast.error('Please sign in (login/register) first to download the PDF.');
      setAuthTab('login');
      setAuthModalOpen(true);
      return;
    }

    if (currentUser.role !== 'admin' && !currentUser.isApproved) {
      toast.error('Your account is waiting for Admin approval ⏳ Please wait for verification.');
      return;
    }

    if (settings?.isPremium && img.price > 0) {
      setPremiumItemToDownload({ type: 'gallery', data: img });
      setPremiumQrModalOpen(true);
      return;
    }

    executePDFDownload(img);
  };

  // Download Generated AI SVG Card as PDF (handles authentication and premium check)
  const downloadAiCardAsPDF = () => {
    if (!generatedSvg) return;

    if (!currentUser) {
      toast.error('Please sign in (login/register) first to download the PDF.');
      setAuthTab('login');
      setAuthModalOpen(true);
      return;
    }

    if (currentUser.role !== 'admin' && !currentUser.isApproved) {
      toast.error('Your account is waiting for Admin approval ⏳ Please wait for verification.');
      return;
    }

    const styleIdx = TEMPLATE_STYLES.findIndex(s => s.id === aiForm.selectedStyle);
    const isPremiumTemplate = styleIdx >= 15;

    if (isPremiumTemplate) {
      setPremiumItemToDownload({ type: 'ai', data: generatedSvg });
      setPremiumQrModalOpen(true);
      return;
    }

    executeAiPDFDownload(generatedSvg);
  };

  // Handle premium payment verification & trigger download
  const handleVerifyPremiumPayment = () => {
    if (!premiumUpiRef.trim() || premiumUpiRef.trim().length < 12) {
      toast.error('Please enter a valid 12-digit UPI Transaction ID / UTR');
      return;
    }

    setVerifyingPremium(true);
    setTimeout(() => {
      toast.success('Payment submitted! Starting your premium download... 📥');
      setPremiumQrModalOpen(false);
      setPremiumUpiRef('');

      if (premiumItemToDownload) {
        if (premiumItemToDownload.type === 'gallery') {
          executePDFDownload(premiumItemToDownload.data);
        } else {
          executeAiPDFDownload(premiumItemToDownload.data);
        }
      }
      setVerifyingPremium(false);
    }, 1500);
  };

  // Checkout submit
  const handleCheckout = async () => {
    if (!checkoutData.customerName.trim() || !checkoutData.phone.trim() || !checkoutData.upiRef.trim()) {
      toast.error('Please fill all fields');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: checkoutData.customerName,
          phone: checkoutData.phone,
          items: cart.map(i => ({ imageId: i._id, title: i.title, price: i.price, imageUrl: i.imageUrl })),
          total: cartTotal,
          upiRef: checkoutData.upiRef,
        }),
      });
      if (!res.ok) throw new Error('Order failed');
      toast.success('Order placed! We will confirm after payment verification.');
      setCart([]);
      setCheckoutOpen(false);
      setCartOpen(false);
      setCheckoutData({ customerName: '', phone: '', upiRef: '' });
    } catch {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Helper to determine price of premium item
  const getPremiumItemPrice = () => {
    if (!premiumItemToDownload) return 4999;
    if (premiumItemToDownload.type === 'gallery') {
      return premiumItemToDownload.data.price;
    }
    return 4999;
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)', position: 'relative', overflowX: 'hidden' }} id="home">
      {/* Decorative Background Glows */}
      <div className="hero-glow hero-glow-1" />
      <div className="hero-glow hero-glow-2" />

      {/* ─── Premium Header ───────────────────────────────────────────── */}
      <header style={{
        height: 90,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 5%',
        background: 'var(--surface)',
        backdropFilter: 'blur(24px)',
        borderBottom: '1px solid var(--border-soft)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14,
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 30px var(--accent-glow)',
            fontWeight: 800, fontSize: 22, color: '#fff',
          }}>
            ❤️
          </div>
          <span style={{ fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em', background: 'linear-gradient(to right, var(--fg), var(--ink-soft))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Dwivedi's
          </span>
        </div>

        {/* Menu Nav Links with Scroll to Anchor (Mockup style settings: 16px, 500 weight) */}
        <nav style={{ display: 'flex', gap: 32, alignItems: 'center', margin: '0 auto' }} className="desktop-menu">
          <button onClick={() => scrollToSection('home')} style={{ color: 'var(--fg)', fontWeight: 600, fontSize: 16, transition: 'var(--transition)' }}>
            Home
          </button>
          <button onClick={() => scrollToSection('features')} style={{ color: 'var(--ink-soft)', fontWeight: 500, fontSize: 16, transition: 'var(--transition)' }}>
            Services
          </button>
          {/* 
          <button onClick={() => scrollToSection('calculator')} style={{ color: 'var(--ink-soft)', fontWeight: 500, fontSize: 16, transition: 'var(--transition)' }}>
            Budget Estimator
          </button>
          */}
          <button onClick={() => scrollToSection('gallery')} style={{ color: 'var(--ink-soft)', fontWeight: 500, fontSize: 16, transition: 'var(--transition)' }}>
            Design Gallery
          </button>
          <button
            onClick={() => {
              setActiveTab('god');
              scrollToSection('gallery');
            }}
            style={{ color: 'var(--ink-soft)', fontWeight: 500, fontSize: 16, transition: 'var(--transition)' }}
          >
            Shyam Baba (God Pic) 🔱
          </button>
          <button
            onClick={() => {
              setActiveTab('frame');
              scrollToSection('gallery');
            }}
            style={{ color: 'var(--ink-soft)', fontWeight: 500, fontSize: 16, transition: 'var(--transition)' }}
          >
            Frames 🖼️
          </button>
          <button
            onClick={() => {
              setActiveTab('ai');
              scrollToSection('generator');
            }}
            style={{ color: 'var(--accent)', fontWeight: 600, fontSize: 16, transition: 'var(--transition)' }}
          >
            AI Generator 🤖
          </button>
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Theme Toggle Button */}
          <button
            className="btn-icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            style={{ width: 44, height: 44, fontSize: 18 }}
            title="Toggle theme mode"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {/* Persistent Cart Button */}
          <button
            className="btn-ghost"
            onClick={() => setCartOpen(true)}
            style={{ position: 'relative', gap: 8, padding: '10px 20px', borderRadius: 100, fontSize: 16, fontWeight: 500 }}
          >
            🛒 Cart
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: -6, right: -6,
                background: 'var(--accent)', color: '#fff',
                borderRadius: '50%', width: 22, height: 22,
                fontSize: 11, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 10px var(--accent)',
              }}>{cartCount}</span>
            )}
          </button>

          {currentUser?.role === 'admin' && (
            <a href="/admin" style={{ color: 'var(--ink-soft)', fontWeight: 500, fontSize: 16, marginRight: 8 }}>
              Admin Panel
            </a>
          )}

          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)' }} className="desktop-menu">
                {currentUser.email.split('@')[0]} {currentUser.isApproved ? '🟢' : '⏳'}
              </span>
              <button
                onClick={handleUserLogout}
                className="btn-ghost"
                style={{ padding: '10px 20px', borderRadius: 100, fontSize: 16, fontWeight: 500 }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setAuthTab('login'); setAuthModalOpen(true); }}
              className="btn-primary"
              style={{ padding: '12px 28px', borderRadius: 100, fontSize: 16, fontWeight: 500 }}
            >
              Sign In / Register
            </button>
          )}
        </div>
      </header>

      {/* ─── Hero Section with budget package calculator ──── */}
      <section style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '80px 5%',
        position: 'relative',
        zIndex: 1,
        minHeight: '85vh',
        flexWrap: 'wrap',
        gap: 60,
      }}>
        {/* Left Side Info */}
        <div style={{ flex: '1 1 500px', maxWidth: 620 }}>
          <h2 style={{ fontSize: 18, color: 'var(--accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            When your <span style={{ color: 'var(--accent)', animation: 'float 3s infinite' }}>❤️</span>
          </h2>
          <h1 style={{
            fontSize: 'clamp(44px, 6vw, 72px)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: 24,
            color: 'var(--fg)',
            letterSpacing: '-0.02em',
          }}>
            Dream Wedding <br />
            come true
          </h1>
          <p style={{
            color: 'var(--ink-soft)',
            fontSize: 16,
            lineHeight: 1.8,
            marginBottom: 36,
            fontStyle: 'italic',
            borderLeft: '4px solid var(--accent)',
            paddingLeft: 20,
          }}>
            "Once in a while, right in the middle of an ordinary life, love gives us a fairy tale."
          </p>

          {/* Quick Category Filters */}
          <div style={{ maxWidth: 520, marginBottom: 44 }}>
            <p style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '0.05em', marginBottom: 12 }}>
              🎨 Select Category to Filter Designs
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id === 'ai') {
                      scrollToSection('generator');
                    } else {
                      scrollToSection('gallery');
                    }
                  }}
                  className={`btn-ghost ${activeTab === tab.id ? 'active' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '12px 14px',
                    fontSize: 13,
                    borderRadius: 12,
                    background: activeTab === tab.id ? 'linear-gradient(135deg, var(--accent), var(--accent-2))' : 'var(--surface)',
                    border: '1px solid var(--border-soft)',
                    color: activeTab === tab.id ? '#fff' : 'var(--fg)',
                    boxShadow: activeTab === tab.id ? '0 4px 12px var(--accent-glow)' : 'none',
                    transition: 'var(--transition)',
                    cursor: 'pointer'
                  }}
                >
                  <span>{tab.emoji}</span>
                  <span style={{ fontWeight: 700 }}>{tab.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Contact Us Query Form */}
          <div
            className="glass"
            style={{
              padding: 24,
              borderRadius: 20,
              border: '1px solid var(--border-soft)',
              boxShadow: 'var(--shadow-soft)',
            }}
            id="features"
          >
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
              ✉️ Contact Us
            </h3>
            <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 18 }}>
              Have questions or request custom work? Send a query directly to our support desk.
            </p>

            <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                <div>
                  <label className="label" style={{ fontSize: 11, marginBottom: 6 }}>Your Name</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter your name"
                    value={contactName}
                    onChange={e => setContactName(e.target.value)}
                    required
                    style={{ padding: '10px 14px', fontSize: 13 }}
                  />
                </div>
                <div>
                  <label className="label" style={{ fontSize: 11, marginBottom: 6 }}>Email Address</label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="Enter email"
                    value={contactEmail}
                    onChange={e => setContactEmail(e.target.value)}
                    required
                    style={{ padding: '10px 14px', fontSize: 13 }}
                  />
                </div>
              </div>

              <div>
                <label className="label" style={{ fontSize: 11, marginBottom: 6 }}>Your Message / Query</label>
                <textarea
                  className="input-field"
                  placeholder="How can we help you today?"
                  value={contactMessage}
                  onChange={e => setContactMessage(e.target.value)}
                  required
                  rows={3}
                  style={{
                    padding: '10px 14px',
                    fontSize: 13,
                    resize: 'none',
                    borderRadius: 12,
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={contactSubmitting}
                className="btn-primary"
                style={{
                  padding: '12px 20px',
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                {contactSubmitting ? 'Sending...' : '📩 Send Query'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side Visual Block */}
        <div style={{
          flex: '1 1 450px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 20,
        }}>
          {/* Decorative striped pattern matching reference */}
          <div className="striped-pattern" />

          {/* Main Visual Cinema Card Shape */}
          <div style={{
            position: 'relative',
            width: '100%',
            borderRadius: 24,
            overflow: 'hidden',
            border: '6px solid var(--surface)',
            boxShadow: 'var(--shadow-soft)',
            animation: 'float 6s ease-in-out infinite',
            aspectRatio: '16/10',
            background: '#000',
          }}>
            <video
              key={heroVideoSrc} // Key forces React to reload and replay the video automatically when source changes!
              src={heroVideoSrc}
              poster="/uploads/1782891959586-qd10sq48dg.jpg"
              autoPlay
              loop
              muted
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Interactive Video Switcher Tabs */}
          <div style={{
            display: 'flex',
            gap: 12,
            zIndex: 10,
            background: 'var(--surface)',
            padding: '6px 12px',
            borderRadius: 100,
            border: '1px solid var(--border-soft)',
            boxShadow: 'var(--shadow-soft)',
          }}>
            <button
              onClick={() => setHeroVideoSrc('/uploads/3936463-hd_1920_1080_25fps.mp4')}
              style={{
                padding: '8px 16px',
                borderRadius: 100,
                fontSize: 13,
                fontWeight: 600,
                background: heroVideoSrc === '/uploads/3936463-hd_1920_1080_25fps.mp4' ? 'linear-gradient(135deg, var(--accent), var(--accent-2))' : 'transparent',
                color: heroVideoSrc === '/uploads/3936463-hd_1920_1080_25fps.mp4' ? '#fff' : 'var(--fg)',
                boxShadow: heroVideoSrc === '/uploads/3936463-hd_1920_1080_25fps.mp4' ? '0 4px 12px var(--accent-glow)' : 'none',
                transition: 'var(--transition)',
                cursor: 'pointer'
              }}
            >
              💍 Wedding Tour
            </button>
            <button
              onClick={() => setHeroVideoSrc('/uploads/7150137-uhd_3840_2160_30fps.mp4')}
              style={{
                padding: '8px 16px',
                borderRadius: 100,
                fontSize: 13,
                fontWeight: 600,
                background: heroVideoSrc === '/uploads/7150137-uhd_3840_2160_30fps.mp4' ? 'linear-gradient(135deg, var(--accent), var(--accent-2))' : 'transparent',
                color: heroVideoSrc === '/uploads/7150137-uhd_3840_2160_30fps.mp4' ? '#fff' : 'var(--fg)',
                boxShadow: heroVideoSrc === '/uploads/7150137-uhd_3840_2160_30fps.mp4' ? '0 4px 12px var(--accent-glow)' : 'none',
                transition: 'var(--transition)',
                cursor: 'pointer'
              }}
            >
              🎂 Birthday Party
            </button>
            <button
              onClick={() => setHeroVideoSrc('/uploads/8844430-uhd_2160_3840_30fps.mp4')}
              style={{
                padding: '8px 16px',
                borderRadius: 100,
                fontSize: 13,
                fontWeight: 600,
                background: heroVideoSrc === '/uploads/8844430-uhd_2160_3840_30fps.mp4' ? 'linear-gradient(135deg, var(--accent), var(--accent-2))' : 'transparent',
                color: heroVideoSrc === '/uploads/8844430-uhd_2160_3840_30fps.mp4' ? '#fff' : 'var(--fg)',
                boxShadow: heroVideoSrc === '/uploads/8844430-uhd_2160_3840_30fps.mp4' ? '0 4px 12px var(--accent-glow)' : 'none',
                transition: 'var(--transition)',
                cursor: 'pointer'
              }}
            >
              🏡 Home Invitation
            </button>
            <button
              onClick={() => setHeroVideoSrc('/uploads/8855233-uhd_3840_2160_30fps.mp4')}
              style={{
                padding: '8px 16px',
                borderRadius: 100,
                fontSize: 13,
                fontWeight: 600,
                background: heroVideoSrc === '/uploads/8855233-uhd_3840_2160_30fps.mp4' ? 'linear-gradient(135deg, var(--accent), var(--accent-2))' : 'transparent',
                color: heroVideoSrc === '/uploads/8855233-uhd_3840_2160_30fps.mp4' ? '#fff' : 'var(--fg)',
                boxShadow: heroVideoSrc === '/uploads/8855233-uhd_3840_2160_30fps.mp4' ? '0 4px 12px var(--accent-glow)' : 'none',
                transition: 'var(--transition)',
                cursor: 'pointer'
              }}
            >
              ✨ Festival Video
            </button>
          </div>

          {/* Scroll Down element */}
          <div style={{
            position: 'absolute',
            left: -40,
            bottom: 60,
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            color: 'var(--ink-soft)',
            fontSize: 11,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }} className="desktop-menu">
            <span>Scroll Down</span>
            <div style={{ width: 2, height: 50, background: 'var(--border-soft)' }} />
          </div>
        </div>
      </section>

      {/* ─── Gallery Section ─────────────────────────────────────────── */}
      <section style={{
        maxWidth: 1200, margin: '80px auto 0',
        padding: '0 5%', position: 'relative', zIndex: 1,
      }} id="gallery">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span className="badge badge-accent" style={{ marginBottom: 16 }}>Collection</span>
          <h2 className="font-display" style={{ fontSize: 40, fontWeight: 800, marginBottom: 14 }}>
            Explore <span className="text-gradient">Invitation Gallery</span>
          </h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, maxWidth: 600, margin: '0 auto' }}>
            Select an event category to view templates, customize details, and download invitations.
          </p>
        </div>

        {/* Tab Filters */}
        <div style={{ maxWidth: 960, margin: '0 auto 48px', padding: '0 16px' }}>
          <div className="tab-bar">
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.emoji} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Live Gallery Grid / AI Workspace ───────────── */}
      <main style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '0 5% 100px',
        position: 'relative', zIndex: 1,
      }} id="generator">
        {activeTab === 'ai' ? (
          /* ─── AI Card Builder UI Workspace ─── */
          <div style={{
            display: 'flex', gap: 40, flexWrap: 'wrap',
            justifyContent: 'center',
            background: 'var(--surface)',
            border: '1px solid var(--border-soft)',
            padding: 40, borderRadius: 24,
            boxShadow: 'var(--shadow-soft)',
          }}>
            {/* Inputs Panel */}
            <div style={{ flex: '1 1 450px', maxWidth: 620 }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>🤖 AI & Template Card Generator</h3>

              {/* Account approval notice */}
              {currentUser && !currentUser.isApproved && (
                <div style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid #f59e0b',
                  borderRadius: 12,
                  padding: '12px 16px',
                  color: '#f59e0b',
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 20
                }} className="anim-fade-in">
                  ⏳ Your account ({currentUser.email}) is pending verification/approval from the Admin. Card generation is temporarily locked.
                </div>
              )}

              {/* Guest limit notice */}
              {!currentUser && (
                <div style={{
                  background: 'rgba(255, 45, 120, 0.1)',
                  border: '1px solid var(--accent)',
                  borderRadius: 12,
                  padding: '12px 16px',
                  color: 'var(--fg)',
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 20
                }}>
                  ✨ Free Trial Mode: You can generate up to 2 cards without signing in. (Attempts: {trialCount}/2)
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="label">Event Category</label>
                  <select
                    className="select-field"
                    value={aiForm.eventType}
                    onChange={e => setAiForm(p => ({ ...p, eventType: e.target.value }))}
                  >
                    <option>Wedding Invitation</option>
                    <option>Birthday Card</option>
                    <option>Anniversary Invitation</option>
                    <option>Housewarming Invitation</option>
                  </select>
                </div>

                <div>
                  <label className="label">Celebrant Names</label>
                  <input
                    className="input-field"
                    value={aiForm.names}
                    onChange={e => setAiForm(p => ({ ...p, names: e.target.value }))}
                    placeholder="e.g. Aditya & Priya"
                  />
                </div>

                <div>
                  <label className="label">Date & Time</label>
                  <input
                    className="input-field"
                    value={aiForm.date}
                    onChange={e => setAiForm(p => ({ ...p, date: e.target.value }))}
                    placeholder="e.g. November 26, 2026 at 7:00 PM"
                  />
                </div>

                <div>
                  <label className="label">Venue Location</label>
                  <input
                    className="input-field"
                    value={aiForm.venue}
                    onChange={e => setAiForm(p => ({ ...p, venue: e.target.value }))}
                    placeholder="e.g. Royal Orchid Banquet, New Delhi"
                  />
                </div>

                {/* Animated Visual Card Template Picker */}
                <div>
                  <label className="label" style={{ marginBottom: 12 }}>🎨 Select Design Template (15 Free &amp; 5 Premium)</label>
                  <div style={{
                    display: 'flex',
                    gap: 12,
                    overflowX: 'auto',
                    padding: '4px 4px 16px',
                    scrollbarWidth: 'thin',
                  }} className="visual-template-scroll">
                    {TEMPLATE_STYLES.map((style, idx) => {
                      const isPremium = idx >= 15;
                      const isSelected = aiForm.selectedStyle === style.id;

                      let cardBg = '#0b0c10';
                      if (style.id.includes('pink') || style.id.includes('floral')) cardBg = '#1c1015';
                      if (style.id.includes('blue')) cardBg = '#06132b';
                      if (style.id.includes('green') || style.id.includes('eucalyptus')) cardBg = '#0c140e';
                      if (style.id.includes('ruby') || style.id.includes('traditional') || style.id.includes('marigold')) cardBg = '#260408';
                      if (style.id.includes('pastel') || style.id.includes('white') || style.id.includes('anniversary')) cardBg = '#eaeaea';

                      return (
                        <div
                          key={style.id}
                          onClick={() => setAiForm(p => ({ ...p, selectedStyle: style.id }))}
                          style={{
                            flex: '0 0 135px',
                            height: 180,
                            borderRadius: 16,
                            background: cardBg,
                            border: isSelected ? '3px solid var(--accent)' : '1px solid var(--border-soft)',
                            padding: '12px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            transition: 'var(--transition)',
                            boxShadow: isSelected ? '0 0 15px var(--accent-glow)' : 'var(--shadow-soft)',
                            transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                            position: 'relative',
                            overflow: 'hidden',
                          }}
                          className="template-card-picker-item"
                        >
                          <span style={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            fontSize: 10,
                            fontWeight: 800,
                            padding: '3px 6px',
                            borderRadius: 100,
                            background: isPremium ? 'linear-gradient(135deg, #eab308, #ca8a04)' : '#22c55e',
                            color: '#fff',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                          }}>
                            {isPremium ? '⭐ VIP' : 'FREE'}
                          </span>

                          <div style={{ fontSize: 24, marginTop: 12 }}>
                            {style.name.split(' ')[0]}
                          </div>

                          <div>
                            <p style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: style.id.includes('pastel') || style.id.includes('anniversary') ? '#333' : '#fff',
                              lineHeight: 1.2,
                              margin: 0,
                            }}>
                              {style.name.split(' ').slice(1).join(' ')}
                            </p>
                            <span style={{
                              fontSize: 9,
                              color: isSelected ? 'var(--accent)' : (style.id.includes('pastel') || style.id.includes('anniversary') ? '#777' : '#ffffffb0'),
                              textTransform: 'uppercase',
                              fontWeight: 600,
                            }}>
                              {style.category}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="label">Design Theme Style (For Grok AI)</label>
                  <select
                    className="select-field"
                    value={aiForm.theme}
                    onChange={e => setAiForm(p => ({ ...p, theme: e.target.value }))}
                  >
                    <option>Luxury Gold & Black</option>
                    <option>Elegant Blush Pink & White</option>
                    <option>Deep Navy Blue & Silver</option>
                    <option>Minimalist Floral White</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 10 }}>
                  <button
                    className="btn-primary"
                    style={{ justifyContent: 'center', padding: '14px', fontSize: 14 }}
                    onClick={generateAiCard}
                    disabled={generatingAi}
                  >
                    {generatingAi ? (
                      <><div className="spinner" /> Designing Card...</>
                    ) : (
                      '🤖 Grok Generate Card'
                    )}
                  </button>

                  <button
                    className="btn-ghost"
                    style={{ justifyContent: 'center', padding: '14px', fontSize: 14, borderRadius: 100 }}
                    onClick={generateNormalCard}
                  >
                    🎨 Generate Normal Card
                  </button>
                </div>
              </div>
            </div>

            {/* Preview Output Panel */}
            <div style={{
              flex: '1 1 400px',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              borderLeft: '1px solid var(--border-soft)',
              paddingLeft: 40,
              minHeight: 480,
            }} className="desktop-menu">
              {generatingAi ? (
                <div style={{ width: '100%', maxWidth: 360, textAlign: 'center' }}>
                  <div className="shimmer animate-pulse" style={{ width: '100%', aspectRatio: '3/4', borderRadius: 20, marginBottom: 20 }} />
                  <p style={{ color: 'var(--ink-soft)', fontSize: 13 }}>Grok AI is rendering vector graphics...</p>
                </div>
              ) : generatedSvg ? (
                <div style={{ width: '100%', maxWidth: 380, textAlign: 'center' }} className="anim-scale-in">
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '3/4',
                      border: '1px solid var(--border-soft)',
                      borderRadius: 20,
                      overflow: 'hidden',
                      boxShadow: 'var(--shadow-soft)',
                      background: '#000',
                      marginBottom: 20,
                      transition: 'all 0.5s ease',
                    }}
                    dangerouslySetInnerHTML={{ __html: generatedSvg }}
                  />
                  <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={downloadAiCardAsPDF}>
                    📥 Download PDF Card
                  </button>
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--ink-soft)' }}>
                  <div style={{ fontSize: 64, marginBottom: 20 }}>🎨</div>
                  <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--fg)', marginBottom: 8 }}>Card Preview</p>
                  <p style={{ fontSize: 13 }}>Generate with Grok or select a template style to preview.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ─── Static uploaded category gallery cards ─── */
          <>
            {loading ? (
              <div className="gallery-grid">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="shimmer" style={{
                    borderRadius: 'var(--radius-lg)',
                    aspectRatio: '3/4',
                  }} />
                ))}
              </div>
            ) : images.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '100px 24px',
                color: 'var(--ink-soft)',
                background: 'var(--surface)',
                borderRadius: 24,
                border: '1px solid var(--border-soft)',
              }}>
                <div style={{ fontSize: 64, marginBottom: 20 }}>
                  {TABS.find(t => t.id === activeTab)?.emoji}
                </div>
                <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 10, color: 'var(--fg)', textTransform: 'capitalize' }}>
                  No {activeTab} designs available yet
                </h3>
                <p style={{ marginBottom: 24 }}>Please log in to the Admin Panel to add templates or upload designs.</p>
                <a href="/admin/upload" className="btn-primary">Upload Design</a>
              </div>
            ) : (
              <div className="gallery-grid">
                {images.map((img, idx) => (
                  <div
                    key={img._id}
                    className="gallery-card anim-fade-up"
                    style={{
                      animationDelay: `${idx * 60}ms`,
                      animationFillMode: 'both',
                      borderRadius: 24,
                    }}
                    onClick={() => setSelectedPreview(img)}
                  >
                    {/* Image view */}
                    <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
                      <img
                        src={img.imageUrl}
                        alt={img.title}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#0b0c10' }}
                      />
                      <span style={{
                        position: 'absolute', top: 12, left: 12,
                        background: '#0b0c10cc',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid var(--border-soft)',
                        borderRadius: 100, padding: '4px 10px',
                        fontSize: 11, fontWeight: 600,
                        color: 'var(--accent)', letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                      }}>
                        {img.category}
                      </span>

                      {/* Actions overlay hover */}
                      <div className="gallery-card-overlay" style={{ gap: 10, padding: 20 }} onClick={(e) => e.stopPropagation()}>
                        <button
                          className="btn-primary"
                          style={{ width: '100%', justifyContent: 'center', fontSize: 13, background: '#fff', color: '#0b0c10' }}
                          onClick={() => downloadAsPDF(img)}
                        >
                          📥 Download PDF
                        </button>
                        <button
                          className="btn-primary"
                          style={{ width: '100%', justifyContent: 'center', fontSize: 13, background: 'var(--surface-2)', color: 'var(--fg)', border: '1px solid var(--border-soft)' }}
                          onClick={() => handleShareCard(img)}
                        >
                          🔗 Share Card
                        </button>
                        {settings?.isPremium && (
                          <button
                            className="btn-primary"
                            style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}
                            onClick={() => addToCart(img)}
                          >
                            🛒 Add to Cart · ₹{img.price}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Footer details */}
                    <div className="gallery-card-info" style={{ padding: '16px 20px' }}>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{img.title}</p>
                        {settings?.isPremium ? (
                          <p style={{ color: 'var(--accent)', fontWeight: 800, fontSize: 16 }}>
                            ₹{img.price}
                          </p>
                        ) : (
                          <p style={{ color: 'var(--ink-soft)', fontSize: 12 }}>
                            Format PDF & Print
                          </p>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: 8 }} onClick={(e) => e.stopPropagation()}>
                        <button
                          className="btn-icon"
                          onClick={() => handleShareCard(img)}
                          title="Share"
                          style={{ width: 36, height: 36 }}
                        >
                          🔗
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => downloadAsPDF(img)}
                          title="Download PDF"
                          style={{ width: 36, height: 36 }}
                        >
                          📥
                        </button>
                        {settings?.isPremium && (
                          <button
                            className="btn-icon"
                            onClick={() => addToCart(img)}
                            title="Add to cart"
                            style={{ width: 36, height: 36 }}
                          >
                            🛒
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* ─── Preview Lightbox Detail Modal ────────────────────────────── */}
      {selectedPreview && (
        <div className="modal-backdrop" onClick={() => setSelectedPreview(null)}>
          <div className="modal" style={{ maxWidth: 840, display: 'flex', flexWrap: 'wrap', overflow: 'hidden', padding: 0 }} onClick={(e) => e.stopPropagation()}>

            {/* Left Side Visual Preview */}
            <div style={{
              flex: '1 1 360px',
              background: '#040508',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
              minHeight: 480,
              position: 'relative',
            }}>
              <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={selectedPreview.imageUrl}
                  alt={selectedPreview.title}
                  style={{
                    maxHeight: '75vh',
                    maxWidth: '100%',
                    borderRadius: 16,
                    boxShadow: 'var(--shadow-soft)',
                    objectFit: 'contain',
                  }}
                />
                {/* Custom Overlay Text on top of Image */}
                {overlayEnabled && (
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    pointerEvents: 'none',
                  }}>
                    {/* Wording Quote / Mantra Overlay */}
                    {overlayQuote && (
                      <div style={{
                        position: 'absolute',
                        top: `${quoteY}%`,
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: textColor,
                        fontSize: `${11 * fontSizeMultiplier}px`,
                        fontWeight: 600,
                        fontStyle: 'italic',
                        fontFamily: "'Outfit', sans-serif",
                        textAlign: 'center',
                        width: '85%',
                        textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                        lineHeight: 1.3,
                      }}>
                        {overlayQuote.toUpperCase()}
                      </div>
                    )}

                    {/* Names Overlay */}
                    <div style={{
                      position: 'absolute',
                      top: `${namesY}%`,
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      color: textColor,
                      fontSize: `${20 * fontSizeMultiplier}px`,
                      fontWeight: 800,
                      fontFamily: "'Outfit', sans-serif",
                      textAlign: 'center',
                      width: '85%',
                      textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                      letterSpacing: '1px',
                    }}>
                      {overlayNames.toUpperCase()}
                    </div>

                    {/* Date Overlay */}
                    <div style={{
                      position: 'absolute',
                      top: `${dateY}%`,
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      color: '#ffffffd0',
                      fontSize: `${13 * fontSizeMultiplier}px`,
                      fontWeight: 600,
                      fontFamily: "'Outfit', sans-serif",
                      textAlign: 'center',
                      width: '85%',
                      textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                      letterSpacing: '1px',
                    }}>
                      {overlayDate.toUpperCase()}
                    </div>

                    {/* Venue Overlay */}
                    <div style={{
                      position: 'absolute',
                      top: `${venueY}%`,
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      color: '#ffffffb8',
                      fontSize: `${11 * fontSizeMultiplier}px`,
                      fontWeight: 500,
                      fontFamily: "'Outfit', sans-serif",
                      textAlign: 'center',
                      width: '85%',
                      textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                    }}>
                      {overlayVenue.toUpperCase()}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side Info Panel */}
            <div style={{
              flex: '1 1 360px',
              padding: 36,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <span className="badge badge-accent" style={{ textTransform: 'uppercase' }}>
                  {selectedPreview.category} Collection
                </span>
                <button className="btn-icon" style={{ width: 36, height: 36 }} onClick={() => setSelectedPreview(null)}>✕</button>
              </div>

              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: 'var(--fg)' }}>
                {selectedPreview.title}
              </h2>

              {/* Customizer Overlay Accordion Panel */}
              <div className="glass-dark" style={{ padding: 18, borderRadius: 16, border: '1px solid var(--border-soft)', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>✍️ Customize Names &amp; Details</span>
                  <label className="toggle" style={{ transform: 'scale(0.8)' }}>
                    <input
                      type="checkbox"
                      checked={overlayEnabled}
                      onChange={e => setOverlayEnabled(e.target.checked)}
                    />
                    <span className="toggle-slider" />
                  </label>
                </div>

                {overlayEnabled && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="anim-fade-in">

                    {/* Wording Quote / Mantra Selector */}
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase' }}>Choose Wording / Mantra</label>
                      <select
                        className="select-field"
                        style={{ padding: '8px 12px', fontSize: 13, marginTop: 4, height: 'auto' }}
                        value={overlayQuote}
                        onChange={e => setOverlayQuote(e.target.value)}
                      >
                        <option value="">-- No Quote / Wording --</option>
                        {(WORDING_QUOTES[selectedPreview.category.toLowerCase()] || WORDING_QUOTES['wedding']).map((q, qidx) => (
                          <option key={qidx} value={q}>
                            {q.length > 40 ? q.slice(0, 37) + '...' : q}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase' }}>Celebrant Names</label>
                      <input
                        className="input-field"
                        style={{ padding: '8px 12px', fontSize: 13, marginTop: 4 }}
                        value={overlayNames}
                        onChange={e => setOverlayNames(e.target.value)}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase' }}>Date &amp; Time</label>
                      <input
                        className="input-field"
                        style={{ padding: '8px 12px', fontSize: 13, marginTop: 4 }}
                        value={overlayDate}
                        onChange={e => setOverlayDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase' }}>Venue Location</label>
                      <input
                        className="input-field"
                        style={{ padding: '8px 12px', fontSize: 13, marginTop: 4 }}
                        value={overlayVenue}
                        onChange={e => setOverlayVenue(e.target.value)}
                      />
                    </div>

                    {/* Y positions sliders */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>

                      {overlayQuote && (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                            <span style={{ color: 'var(--ink-soft)' }}>Wording Y-Position</span>
                            <span>{quoteY}%</span>
                          </div>
                          <input type="range" min="5" max="95" value={quoteY} onChange={e => setQuoteY(parseInt(e.target.value))} style={{ accentColor: 'var(--accent)' }} />
                        </>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                        <span style={{ color: 'var(--ink-soft)' }}>Names Y-Position</span>
                        <span>{namesY}%</span>
                      </div>
                      <input type="range" min="5" max="95" value={namesY} onChange={e => setNamesY(parseInt(e.target.value))} style={{ accentColor: 'var(--accent)' }} />

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                        <span style={{ color: 'var(--ink-soft)' }}>Date Y-Position</span>
                        <span>{dateY}%</span>
                      </div>
                      <input type="range" min="5" max="95" value={dateY} onChange={e => setDateY(parseInt(e.target.value))} style={{ accentColor: 'var(--accent)' }} />

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                        <span style={{ color: 'var(--ink-soft)' }}>Venue Y-Position</span>
                        <span>{venueY}%</span>
                      </div>
                      <input type="range" min="5" max="95" value={venueY} onChange={e => setVenueY(parseInt(e.target.value))} style={{ accentColor: 'var(--accent)' }} />

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                        <span style={{ color: 'var(--ink-soft)' }}>Text Font Size</span>
                        <span>{fontSizeMultiplier}x</span>
                      </div>
                      <input type="range" min="0.5" max="2" step="0.1" value={fontSizeMultiplier} onChange={e => setFontSizeMultiplier(parseFloat(e.target.value))} style={{ accentColor: 'var(--accent)' }} />
                    </div>

                    {/* Color picker */}
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Text Theme Color</label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {['#D4AF37', '#ffffff', '#ff2d78', '#00ffff', '#eab308'].map(color => (
                          <button
                            key={color}
                            onClick={() => setTextColor(color)}
                            style={{
                              width: 22, height: 22, borderRadius: '50%',
                              background: color,
                              border: textColor === color ? '2px solid var(--fg)' : '1px solid var(--border-soft)',
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {settings?.isPremium && (
                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: 12, color: 'var(--ink-soft)', marginBottom: 4 }}>Premium Store Price</p>
                  <p style={{ fontSize: 26, fontWeight: 900, color: 'var(--accent)' }}>₹{selectedPreview.price}</p>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <button
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15 }}
                  onClick={() => { downloadAsPDF(selectedPreview); }}
                >
                  📥 Download Print PDF
                </button>

                <button
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15, background: 'var(--surface-2)', color: 'var(--fg)', border: '1px solid var(--border-soft)' }}
                  onClick={() => { handleShareCard(selectedPreview); }}
                >
                  🔗 Share Card
                </button>

                {settings?.isPremium && (
                  <button
                    className="btn-ghost"
                    style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15, background: 'var(--surface-2)' }}
                    onClick={() => { addToCart(selectedPreview); setSelectedPreview(null); }}
                  >
                    🛒 Add to Cart &amp; Checkout
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ─── User Login/Signup Modal (with JWT protection) ─── */}
      {authModalOpen && (
        <div className="modal-backdrop" onClick={() => setAuthModalOpen(false)}>
          <div className="modal" style={{ maxWidth: 440, padding: 36 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800 }}>
                {authTab === 'login' ? '🔑 Sign In' : '📝 Register Account'}
              </h2>
              <button className="btn-icon" onClick={() => setAuthModalOpen(false)}>✕</button>
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
              <button
                className={`btn-ghost ${authTab === 'login' ? 'active' : ''}`}
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setAuthTab('login')}
              >
                Sign In
              </button>
              <button
                className={`btn-ghost ${authTab === 'register' ? 'active' : ''}`}
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setAuthTab('register')}
              >
                Sign Up
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="label">Email Address</label>
                <input
                  className="input-field"
                  type="email"
                  placeholder="name@example.com"
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="label">Password (Min 6 Characters)</label>
                <div style={{ position: 'relative' }}>
                  <input
                    key={showPassword ? 'pass-visible' : 'pass-hidden'}
                    className="input-field"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={authPassword}
                    onChange={e => setAuthPassword(e.target.value)}
                    style={{ paddingRight: 40 }}
                  />
                  <button
                    type="button"
                    onMouseDown={e => { e.preventDefault(); e.stopPropagation(); }}
                    onClick={e => { e.preventDefault(); e.stopPropagation(); setShowPassword(!showPassword); }}
                    style={{
                      position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--ink-soft)',
                      zIndex: 10
                    }}
                  >
                    {showPassword ? '👁️' : '🙈'}
                  </button>
                </div>
              </div>

              {authTab === 'register' && (
                <div>
                  <label className="label">Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      key={showConfirmPassword ? 'confirm-visible' : 'confirm-hidden'}
                      className="input-field"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={authConfirmPassword}
                      onChange={e => setAuthConfirmPassword(e.target.value)}
                      style={{ paddingRight: 40 }}
                    />
                    <button
                      type="button"
                      onMouseDown={e => { e.preventDefault(); e.stopPropagation(); }}
                      onClick={e => { e.preventDefault(); e.stopPropagation(); setShowConfirmPassword(!showConfirmPassword); }}
                      style={{
                        position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--ink-soft)',
                        zIndex: 10
                      }}
                    >
                      {showConfirmPassword ? '👁️' : '🙈'}
                    </button>
                  </div>
                </div>
              )}

              {authTab === 'register' && (
                <p style={{ fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                  ℹ️ After registering, your account status will be <strong>Pending Approval</strong>. The admin will verify your account before you can generate invitation cards.
                </p>
              )}

              <button
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: 12, padding: 14 }}
                onClick={handleAuthSubmit}
                disabled={authLoading}
              >
                {authLoading ? (
                  <><div className="spinner" /> Processing...</>
                ) : authTab === 'login' ? (
                  'Sign In'
                ) : (
                  'Register New Account'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Premium QR Code Unlock Download Modal ─── */}
      {premiumQrModalOpen && (
        <div className="modal-backdrop" onClick={() => setPremiumQrModalOpen(false)}>
          <div className="modal" style={{ maxWidth: 460, padding: 36, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>🌟 Unlock Premium Invitation</h2>
              <button className="btn-icon" onClick={() => setPremiumQrModalOpen(false)}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <p style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
                This is a premium VIP design card. Please scan the QR code below using Google Pay, PhonePe, or Paytm to pay <strong>₹{getPremiumItemPrice()}</strong>.
              </p>

              {/* Dynamic scan-to-pay UPI QR code */}
              <div style={{
                background: '#fff',
                padding: 16,
                borderRadius: 16,
                boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                border: '1px solid var(--border-soft)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 216,
                height: 216
              }}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                    `upi://pay?pa=${settings?.upiId || 'dwivedi@upi'}&pn=${encodeURIComponent(settings?.upiName || "Dwivedi's Enterprise")}&am=${getPremiumItemPrice()}&cu=INR`
                  )}`}
                  alt="Payment UPI QR"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>

              <div style={{ width: '100%', textAlign: 'left', marginTop: 8 }}>
                <p style={{ fontSize: 12, fontWeight: 700, marginBottom: 2 }}>UPI ID: <span style={{ color: 'var(--accent)' }}>{settings?.upiId || 'dwivedi@upi'}</span></p>
                <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)' }}>Payee: {settings?.upiName || "Dwivedi's Enterprise"}</p>
              </div>

              <div className="divider" style={{ width: '100%', margin: '8px 0' }} />

              <div style={{ width: '100%', textAlign: 'left' }}>
                <label className="label" style={{ fontSize: 12, fontWeight: 700, marginBottom: 8, display: 'block' }}>
                  UPI UTR / Transaction ID (12 Digits) *
                </label>
                <input
                  className="input-field"
                  placeholder="e.g. 123456789012"
                  value={premiumUpiRef}
                  onChange={e => setPremiumUpiRef(e.target.value.replace(/\D/g, '').slice(0, 12))}
                  style={{ padding: '10px 14px', fontSize: 14 }}
                />
                <p style={{ fontSize: 10, color: 'var(--ink-soft)', marginTop: 4 }}>
                  Enter the 12-digit UPI UTR reference number after completing payment to start the PDF download.
                </p>
              </div>

              <button
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: 14, fontSize: 14, marginTop: 10 }}
                onClick={handleVerifyPremiumPayment}
                disabled={verifyingPremium}
              >
                {verifyingPremium ? (
                  <><div className="spinner" /> Verifying...</>
                ) : (
                  '🔓 Verify & Download PDF'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Cart Drawer ─── */}
      {cartOpen && (
        <>
          <div className="cart-backdrop" onClick={() => setCartOpen(false)} />
          <aside className="cart-drawer">
            <div style={{
              padding: '24px',
              borderBottom: '1px solid var(--border-soft)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <h2 style={{ fontSize: 20, fontWeight: 800 }}>
                🛒 Your Cart ({cartCount})
              </h2>
              <button className="btn-icon" onClick={() => setCartOpen(false)}>✕</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--ink-soft)' }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
                  <p>Your cart is empty</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item._id} style={{
                    display: 'flex', gap: 14, marginBottom: 16,
                    padding: 16, borderRadius: 'var(--radius-md)',
                    background: 'var(--surface)',
                    border: '1px solid var(--border-soft)',
                  }}>
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      style={{ width: 70, height: 70, borderRadius: 12, objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{item.title}</p>
                      <p style={{ color: 'var(--accent)', fontWeight: 800 }}>₹{item.price}</p>
                    </div>
                    <button
                      style={{ color: 'var(--ink-soft)', fontSize: 20, padding: '0 4px' }}
                      onClick={() => removeFromCart(item._id)}
                    >✕</button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div style={{
                padding: '24px',
                borderTop: '1px solid var(--border-soft)',
              }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  marginBottom: 20, fontSize: 20, fontWeight: 800,
                }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--accent)' }}>₹{cartTotal}</span>
                </div>
                <button
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', fontSize: 15, padding: 14 }}
                  onClick={() => {
                    if (!currentUser) {
                      toast.error('Please login or register first to complete your checkout.');
                      setAuthTab('login');
                      setAuthModalOpen(true);
                      return;
                    }
                    setCartOpen(false);
                    setCheckoutOpen(true);
                  }}
                >
                  Proceed to Checkout →
                </button>
              </div>
            )}
          </aside>
        </>
      )}

      {/* ─── Checkout Modal ─── */}
      {checkoutOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <div style={{
              padding: '24px 28px 0',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <h2 style={{ fontSize: 22, fontWeight: 800 }}>💳 Checkout</h2>
              <button className="btn-icon" onClick={() => setCheckoutOpen(false)}>✕</button>
            </div>

            <div style={{ padding: '24px 28px' }}>
              {settings?.upiId && (
                <div style={{
                  background: 'var(--accent-glow)',
                  border: '1px solid var(--accent)',
                  borderRadius: 'var(--radius-md)',
                  padding: '18px',
                  marginBottom: 24,
                  textAlign: 'center',
                }}>
                  <p style={{ fontSize: 12, color: 'var(--ink-soft)', marginBottom: 8 }}>Pay via UPI to</p>
                  <p style={{ fontWeight: 800, fontSize: 20, color: 'var(--accent)', letterSpacing: '0.02em' }}>
                    {settings.upiId}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 4 }}>
                    {settings.upiName}
                  </p>
                  <div className="divider" style={{ margin: '14px 0' }} />
                  <p style={{ fontSize: 14, fontWeight: 700 }}>
                    Amount: <span style={{ color: 'var(--accent)', fontSize: 22 }}>₹{cartTotal}</span>
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="label">Your Name *</label>
                  <input
                    className="input-field"
                    placeholder="Full name"
                    value={checkoutData.customerName}
                    onChange={e => setCheckoutData(p => ({ ...p, customerName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="label">Phone Number *</label>
                  <input
                    className="input-field"
                    placeholder="+91 XXXXX XXXXX"
                    value={checkoutData.phone}
                    onChange={e => setCheckoutData(p => ({ ...p, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="label">UPI Transaction ID *</label>
                  <input
                    className="input-field"
                    placeholder="e.g. 123456789012"
                    value={checkoutData.upiRef}
                    onChange={e => setCheckoutData(p => ({ ...p, upiRef: e.target.value }))}
                  />
                </div>
              </div>

              <button
                className="btn-primary"
                style={{
                  width: '100%', justifyContent: 'center',
                  marginTop: 24, fontSize: 15, padding: '14px',
                }}
                onClick={handleCheckout}
                disabled={submitting}
              >
                {submitting ? (
                  <><div className="spinner" /> Placing Order...</>
                ) : (
                  '✅ Confirm Order'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '50px 24px',
        borderTop: '1px solid var(--border-soft)',
        color: 'var(--ink-soft)',
        fontSize: 14,
      }}>
        <p>© {new Date().getFullYear()} Dwivedi's · Premium Wedding & Event Invitation Gallery</p>
      </footer>
    </div>
  );
}
