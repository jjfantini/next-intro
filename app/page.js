import { Tweet } from "react-tweet";
import { Header } from "./header";

export default function Page() {
  return (
    <section>
      <Header>
        <h1>Jennings</h1>
      </Header>
      <p>This is my amazing site!</p>
      <Tweet id="1767897772236107807" />
    </section>
  );
}

