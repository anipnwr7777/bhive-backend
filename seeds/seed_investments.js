/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex('investments').del();

  const users = await knex('users').select('id');

  const investments = [];
  for (let i = 0; i < 50; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const schemeCode = `SCHEME_${Math.floor(1000 + Math.random() * 9000)}`;
    const purchaseNav = parseFloat((Math.random() * 100).toFixed(2));
    const investmentAmount = parseFloat((Math.random() * 5000 + 500).toFixed(2));

    investments.push({
      user_id: user.id,
      scheme_code: schemeCode,
      purchase_nav: purchaseNav,
      investment_amount: investmentAmount,
      purchase_date: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  await knex('investments').insert(investments);
};
