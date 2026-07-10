import Image from "next/image";
import { navigation } from "@/content/site-content";
import { siteFacts } from "@/content/site-facts";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-lead">
        <Image src="/brand/lemark-white.svg" alt="LEMARK" width={170} height={50} />
        <p>Производитель HPL-пластика полного цикла</p>
        <a className="button button-primary" href="#lead-form">Рассчитать проект</a>
      </div>
      <div className="footer-columns">
        <nav aria-label="Разделы сайта">
          <h2>Разделы</h2>
          {navigation.map((item) => <a key={item.label} href={item.href}>{item.label}</a>)}
        </nav>
        <nav aria-label="Применение HPL">
          <h2>Применение</h2>
          <a href={`${siteFacts.siteUrl}/primenenie-hpl/mebelnyj-plastik-hpl/`}>Мебель</a>
          <a href={`${siteFacts.siteUrl}/primenenie-hpl/hpl-dlya-stroitelstva/`}>Строительство</a>
          <a href={`${siteFacts.siteUrl}/primenenie-hpl/hpl-plastik-dlya-transporta/`}>Транспорт</a>
          <a href={`${siteFacts.siteUrl}/primenenie-hpl/hpl-plastik-dlya-chistyh-pomeschenij/`}>Чистые помещения</a>
        </nav>
        <address>
          <h2>Контакты</h2>
          <a href={siteFacts.phoneHref}>{siteFacts.phoneDisplay}</a>
          <a href={`mailto:${siteFacts.email}`}>{siteFacts.email}</a>
          <p>{siteFacts.address}</p>
          <p>{siteFacts.hours}</p>
          <a href={`${siteFacts.siteUrl}/contacts/`}>Показать на карте</a>
        </address>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} {siteFacts.legalName}</span>
        <a href={siteFacts.privacyUrl}>Политика конфиденциальности</a>
        <span>HPL полного цикла</span>
      </div>
    </footer>
  );
}
