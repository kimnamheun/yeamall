import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 회사 정보 */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-4">예아몰</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>상호: 예아몰 | 대표: 홍길동</p>
              <p>사업자등록번호: 123-45-67890</p>
              <p>통신판매업신고: 제2024-서울강남-0001호</p>
              <p>주소: 서울특별시 강남구 테헤란로 123</p>
              <p>전화: 02-1234-5678 | 이메일: info@yeamall.co.kr</p>
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
            <p className="text-2xl font-bold text-primary mb-2">02-1234-5678</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>평일 09:00 ~ 18:00</p>
              <p>점심시간 12:00 ~ 13:00</p>
              <p>토/일/공휴일 휴무</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-xs text-muted-foreground">
          <p>&copy; 2026 예아몰. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
