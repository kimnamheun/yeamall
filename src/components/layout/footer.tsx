import Link from "next/link";
import { SITE } from "@/lib/constants";

export default function Footer() {
  const { company, cs } = SITE;

  return (
    <footer className="border-t border-border bg-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 회사 정보 */}
          <div>
            <h3 className="text-lg text-primary mb-4 logo-text">{SITE.name}</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>상호: {company.name} | 대표: {company.ceo}</p>
              <p>사업자등록번호: {company.bizNo}</p>
              <p>통신판매업신고: {company.salesNo}</p>
              <p>주소: {company.address}</p>
              <p>전화: {company.phone} | 이메일: {company.email}</p>
            </div>
          </div>

          {/* 고객지원 */}
          <div>
            <h4 className="font-semibold mb-4">고객지원</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/faq" className="hover:text-primary transition-colors">
                  자주묻는 질문
                </Link>
              </li>
              <li>
                <Link href="/notice" className="hover:text-primary transition-colors">
                  공지사항
                </Link>
              </li>
              <li>
                <Link href="/shipping-guide" className="hover:text-primary transition-colors">
                  배송안내
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="hover:text-primary transition-colors">
                  교환/반품 안내
                </Link>
              </li>
            </ul>
          </div>

          {/* 운영시간 */}
          <div>
            <h4 className="font-semibold mb-4">고객센터</h4>
            <p className="text-2xl font-bold text-primary mb-2">{cs.phone}</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>{cs.hours}</p>
              <p>{cs.lunch}</p>
              <p>{cs.holiday}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
