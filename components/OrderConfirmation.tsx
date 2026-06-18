import {
  Html,
  Body,
  Container,
  Heading,
  Text,
  Section,
  Row,
  Column,
  Img,
} from "@react-email/components";

type ProductItem = {
  name: string;
  quantity: number;
  price: number; // cents
  //   image: string; // 👈 add image
};

const OrderConfirmaion = ({
  customerEmail,
  products,
  totalAmount,
}: {
  customerEmail: string;
  products: ProductItem[];
  totalAmount: number;
}) => {
  return (
    <Html>
      <Body style={{ backgroundColor: "#f6f9fc", padding: "20px" }}>
        <Container
          style={{
            backgroundColor: "#ffffff",
            padding: "24px",
            borderRadius: "8px",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <Heading>🛒 Order Confirmation</Heading>

          <Text>Thank you for your order!</Text>
          <Text>
            A confirmation has been sent to <strong>{customerEmail}</strong>
          </Text>

          {/* Header Row */}
          <Section style={{ marginTop: "20px" }}>
            <Row style={{ fontWeight: "bold", borderBottom: "1px solid #eee" }}>
              <Column></Column>
              <Column>Product</Column>
              <Column>Qty</Column>
              <Column>Price</Column>
            </Row>

            {/* Items */}
            {products.map((item, index) => (
              <Row key={index} style={{ marginTop: "10px" }}>
                {/* <Column>
                  <Img
                    src={item.image}
                    width="60"
                    height="60"
                    style={{ borderRadius: "6px", objectFit: "cover" }}
                  />
                </Column> */}

                <Column>{item.name}</Column>
                <Column>{item.quantity}</Column>
                <Column>${(item.price / 100).toFixed(2)}</Column>
              </Row>
            ))}
          </Section>

          {/* Total */}
          <Section
            style={{
              marginTop: "20px",
              borderTop: "1px solid #eee",
              paddingTop: "10px",
            }}
          >
            <Row>
              <Column>
                <strong>Total</strong>
              </Column>
              <Column></Column>
              <Column>
                <strong>${(totalAmount / 100).toFixed(2)}</strong>
              </Column>
            </Row>
          </Section>

          <Text style={{ marginTop: "20px", fontSize: "12px", color: "#888" }}>
            If you have any questions, reply to this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default OrderConfirmaion;
