module.exports = {
  name: 'purge_any_play',
  description: 'Delete any messages you want except those that are pinned',
  options: [
    {
      name: 'num',
      type: 4, //'INTEGER' Type
      description: 'The number of messages you want to delete. (max: inf)',
      required: true,
    },
  ],
  async execute(interaction) {
    const deleteCount = interaction.options.get('num').value;

    // if (!deleteCount || deleteCount < 2 || deleteCount > 100) {
    //   return void interaction.reply({
    //     content: `Please provide a number between 2 and 100 for the number of messages to delete`,
    //     ephemeral: true,
    //   });
    // }

    const fetched = await interaction.channel.messages.fetch({
      limit: deleteCount,
    });

    interaction.channel
      .bulkDelete(fetched)
      .then(() => {
        interaction.reply({
          content: `Succesfully deleted messages`,
          ephemeral: true,
        });
      })
      .catch(error => {
        interaction.reply({
          content: `Couldn't delete messages because of: ${error}`,
          ephemeral: true,
        });
      });
  },
};