import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";

function LoginPage() {
  return (
    <main className="mx-auto max-w-[440px] px-5 py-10">
      <p className="text-primary text-xs font-ui">밝혀줘! 내 X-mas 전구</p>

      <h1 className="mt-10 mb-6 text-3xl font-ui font-bold">로그인</h1>

      <Card>
        <div className="space-y-6">
          <div>
            <Label>아이디</Label>
            <Input placeholder="아이디" />
          </div>

          <div>
            <Label>비밀번호</Label>
            <Input type="password" placeholder="비밀번호" />
          </div>

          <Button>로그인 하기</Button>
        </div>
      </Card>
    </main>
  );
}

export default LoginPage;
