const rules = [
  {
    page: "/login",
    title: "Login",
    description:
      "আপনার বিদ্যমান অ্যাকাউন্টে লগ ইন করতে হোম পেজ থেকে 'Login' বা 'Sign In' বোতামে ক্লিক করুন।",
  },
  {
    page: "/register",
    title: "Register",
    description:
      "আপনার বিদ্যমান অ্যাকাউন্টে লগ ইন করতে, হোম পেজ থেকে 'Register' বোতামে ক্লিক করুন।",
  },
  {
    page: "https://royelbet.com",
    title: "Royel Bet",
    resone: "What is Royel bet and it's system",
    description:
      "Royel bet is a most popular and trusted betting/casino app is bangladesh.",
  },
  {
    page: "/bonus",
    title: "Bonus/Reward",
    resone: "To get bonus from making deposit and betting requirements",
    description:
      "fullfill the deposit and betting requiments to upgrade you vip level. then you will get reward events automatically",
  },
];

export async function getFAQ() {
  return `
Deposit via bKash/Nagad.
Withdraw takes 10 minutes.

Q. How to delete account?
A. Go to the settting page then click delete button

Information : ${JSON.stringify(rules)}
`;
}
