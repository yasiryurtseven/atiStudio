import { useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import emailjs from 'emailjs-com';
import css from './Contact.module.css';
import ShinyText from '../ShinyText/ShinyText';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID; 
const STUDIO_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_STUDIO_TEMPLATE_ID; 
const CLIENT_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_CLIENT_TEMPLATE_ID; 
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const schema = yup.object({
  fullName: yup.string().required('İsim ve soyisim alanı zorunludur.'),
  email: yup.string().email('Geçerli bir e-posta adresi giriniz.').required('E-posta adresi zorunludur.'),
  phone: yup
    .string()
    .matches(/^[0-9+\s()-]+$/, 'Geçerli bir telefon numarası giriniz.')
    .required('Telefon numarası zorunludur.'),
  service: yup.string().required('Lütfen bir hizmet seçiniz.'),
  message: yup.string().min(10, 'Mesajınız en az 10 karakter olmalıdır.').required('Mesaj alanı zorunludur.'),
}).required();

const servicesList = [
  "Görsel Tasarım",
  "Film & Prodüksiyon",
  "Fotoğraf",
  "Dijital Medya",
  "Yazılım"
];

function Contact() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false); // Manuel yüklenme state'i ekledik
  const [isSuccess, setIsSuccess] = useState(false);
  const dropdownRef = useRef(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      service: '',
      message: ''
    }
  });

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onSubmit = (data) => {
    setIsSending(true); // Gönderim başladığı an kilitle ve spinner'ı aç

    const templateParamsStudio = {
      from_name: data.fullName,
      email: data.email,
      phone: data.phone,
      service: data.service,
      message: data.message,
    };

    const templateParamsClient = {
      from_name: data.fullName,
      email: data.email, 
      service: data.service,
    };

    emailjs.send(SERVICE_ID, STUDIO_TEMPLATE_ID, templateParamsStudio, PUBLIC_KEY)
      .then(() => {
        return emailjs.send(SERVICE_ID, CLIENT_TEMPLATE_ID, templateParamsClient, PUBLIC_KEY);
      })
      .then(() => {
        setIsSending(false); // Yüklenme bitti
        setIsSuccess(true);  // Başarılı yeşil metne dön
        reset();
        setTimeout(() => {
          setIsSuccess(false); // 5 saniye sonra normale döndür
        }, 5000);
      })
      .catch((err) => {
        console.error('Mail gönderim hatası:', err);
        alert('Mesaj gönderilirken bir hata oluştu, lütfen tekrar deneyin.');
        setIsSending(false); // Hata olursa da kilidi kaldır
      });
  };

  const handleInstagramClick = () => {
    window.open("https://www.instagram.com/ati.studio.r/", "_blank");
  };

  return (
    <section id="iletişim" className={css.contactSection}>
      <div className={css.container}>
        <div className={css.leftInfo}>
          <h2 className={css.title}> 
            <ShinyText
              text="İletişim"
              color="#0c0c0c"
              shineColor="#ff0000"
              speed={2}
              shineWidth={800}
              softness={1.5}
              trigger="loop"
              delay={0}
              angle={120}
              bands={1}
              glow={0}
              direction="right"
              easing="smooth"
              yoyo={false}
              followPointer={false}
              pauseOnHover={false}
              disabled={false}
            />
          </h2>
          <p className={css.description}>
            Projelerinizi hayata geçirmek, markanıza değer katmak veya sorularınızı yanıtlamak için buradayız.<br/> <br/> Formu doldurun, ekibimiz en kısa sürede sizinle iletişime geçsin.
          </p>

          <div className={css.desktopInstagram} onClick={handleInstagramClick}>
            <span>Instagram üzerinden iletişime geçmek isterseniz</span>
            <span className={css.instaArrow}>→</span>
          </div>
        </div>

        <div className={css.rightForm}>
          <form onSubmit={handleSubmit(onSubmit)} className={css.form}>
            <div className={css.inputGroup}>
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <input
                    type="text"
                    placeholder="İsim ve Soyisminiz"
                    {...field}
                    className={errors.fullName ? css.errorInput : ''}
                  />
                )}
              />
              {errors.fullName && <span className={css.errorText}>{errors.fullName.message}</span>}
            </div>

            <div className={css.inputGroup}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <input
                    type="email"
                    placeholder="E-posta Adresiniz"
                    {...field}
                    className={errors.email ? css.errorInput : ''}
                  />
                )}
              />
              {errors.email && <span className={css.errorText}>{errors.email.message}</span>}
            </div>

            <div className={css.inputGroup}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <input
                    type="tel"
                    placeholder="Telefon Numaranız"
                    {...field}
                    className={errors.phone ? css.errorInput : ''}
                  />
                )}
              />
              {errors.phone && <span className={css.errorText}>{errors.phone.message}</span>}
            </div>

            <div className={css.inputGroup} ref={dropdownRef}>
              <Controller
                name="service"
                control={control}
                render={({ field }) => (
                  <div className={css.customSelectWrapper}>
                    <div 
                      className={`${css.customSelectTrigger} ${isOpen ? css.activeDropdownTrigger : ''} ${errors.service ? css.errorInput : ''} ${field.value ? css.selectedText : ''}`}
                      onClick={() => setIsOpen(!isOpen)}
                    >
                      <span>{field.value || "İlgilendiğiniz Hizmet"}</span>
                      <span className={`${css.redDot} ${isOpen ? css.dotActive : ''}`}></span>
                    </div>

                    {isOpen && (
                      <div className={css.customDropdownMenu}>
                        {servicesList.map((item, index) => (
                          <div
                            key={index}
                            className={`${css.dropdownItem} ${field.value === item ? css.activeItem : ''}`}
                            onClick={() => {
                              field.onChange(item);
                              setIsOpen(false);
                            }}
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              />
              {errors.service && <span className={css.errorText}>{errors.service.message}</span>}
            </div>

            <div className={css.inputGroup}>
              <Controller
                name="message"
                control={control}
                render={({ field }) => (
                  <textarea
                    placeholder="Projeniz veya talebiniz hakkında kısa bir bilgi rica ediyoruz..."
                    rows="4"
                    {...field}
                    className={errors.message ? css.errorInput : ''}
                  ></textarea>
                )}
              />
              {errors.message && <span className={css.errorText}>{errors.message.message}</span>}
            </div>

            <button 
              type="submit" 
              disabled={isSending || isSuccess} 
              className={`${css.submitBtn} ${isSuccess ? css.successBtn : ''}`}
            >
              {isSending ? (
                <span className={css.spinnerContainer}>
                  <span className={css.spinner}></span> Gönderiliyor...
                </span>
              ) : isSuccess ? (
                'Size en kısa zamanda dönüş yapacağız'
              ) : (
                'Gönder'
              )}
            </button>
          </form>

          <div className={css.mobileInstagram} onClick={handleInstagramClick}>
            <span>Instagram üzerinden iletişime geçin</span>
            <span className={css.instaArrow}>→</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;