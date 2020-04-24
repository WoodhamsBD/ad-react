const Mutations = {
  async createItem(parents, args, ctx, info) {
  // TODO Check if logged in
    const item = await ctx.db.mutation.createItem({
      data: {
        ...args
      }
    }, info);
    return item;
  }
};

module.exports = Mutations;
