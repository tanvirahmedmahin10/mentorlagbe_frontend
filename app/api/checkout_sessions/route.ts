import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";

export async function POST() {
  try {
    const headersList = await headers();
    const origin =
      headersList.get("origin") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const session = await auth.api.getSession({
      headers: headersList,
    });

    const user = session?.user as
      | { id: string; email?: string; role?: string; plan?: string; premium?: boolean }
      | undefined;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.plan?.toLowerCase() === "pro" || user.premium) {
      return NextResponse.redirect(`${origin}/payments`, 303);
    }

    const role = user.role?.toLowerCase();
    const priceId =
      role === "tutor"
        ? "price_1UduCfF2UywA6yJfsoGchSGK"
        : "price_1UduBSF2UywA6yJfjwTHauak";

    const checkoutSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: user.email,
      metadata: {
        userId: user.id,
        role: role || "student",
      },
      success_url: `${origin}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payments`,
    });

    return NextResponse.redirect(checkoutSession.url as string, 303);
  } catch (err) {
    const error = err instanceof Error ? err : new Error("Something went wrong");

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
