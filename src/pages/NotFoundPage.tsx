import { Container, Heading, Text, buttonClass } from "@/ui-kit";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  useEffect(() => {
    document.title = "Страница не найдена — Family Dent";
  }, []);

  return (
    <Container
      width="readable"
      className="section-space flex flex-col items-start gap-5"
    >
      <Text variant="overline" tone="secondary">
        404
      </Text>
      <Heading level={1}>Страница не найдена</Heading>
      <Text>Проверьте адрес или вернитесь на главную страницу клиники.</Text>
      <Link to="/" className={buttonClass()}>
        На главную
      </Link>
    </Container>
  );
}
