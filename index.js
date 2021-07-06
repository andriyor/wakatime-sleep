const WakaTimeClient = require('wakatime-client');
const luxon = require('luxon');
const schedule = require('node-schedule');
const execa = require('execa');
require('dotenv').config()

const client = new WakaTimeClient.WakaTimeClient(process.env.WAKATIME_API_TOKEN);
const DATE_FORMAT = 'yyyy-MM-dd';

(async () => {
  schedule.scheduleJob('*/5 * * * *', async () => {
    const { data } = await client.getMe();
    const { timezone } = data;

    const  date = luxon.DateTime.local();
    const localizedDate = date.setZone(timezone);
    const formattedDate = localizedDate.toFormat(DATE_FORMAT);
    const summary = await client.getMySummary({
      dateRange: {
        startDate: formattedDate,
        endDate: formattedDate,
      },
    });

    if (summary.data[0].grand_total.hours > 7) {
      const {stdout} = await execa('sleep', ['5']);
      console.log(stdout);
    }
  });
})();
