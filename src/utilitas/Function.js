export let errMsg = name => {
  return `Terjadi kesalahan saat ${name}. Jika anda rasa ini adalah kesalahan sistem, silakan hubungi 0831-1720-8776 untuk layanan.`;
};

export const toCurrency = (number, decimal) => {
  //untuk menambahkan ppn settingan di view Grandtotal
  var number = parseFloat(number);

  let money = formatMoney(number, decimal);
  return money;
};

const formatMoney = (number, places, symbol, thousand, decimal) => {
  number = number || 0;
  places = !isNaN((places = Math.abs(places))) ? places : 0;
  symbol = symbol !== undefined ? symbol : '';
  thousand = thousand || '.';
  decimal = decimal || ',';
  var negative = number < 0 ? '-' : '',
    i = parseInt((number = Math.abs(+number || 0).toFixed(places)), 10) + '',
    j = (j = i.length) > 3 ? j % 3 : 0;
  return (
    symbol +
    negative +
    (j ? i.substr(0, j) + thousand : '') +
    i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousand) +
    (places
      ? decimal +
        Math.abs(number - i)
          .toFixed(places)
          .slice(2)
      : '')
  );
};

export const getListStatus = [
  {id: -1, status: 'Pesanan Dibatalkan oleh User'},
  {id: 1, status: 'Menunggu Konfirmasi'},
  {id: 2, status: 'Pesanan Ditolak'},
  {id: 3, status: 'Pesanan Diterima'},
  {id: 4, status: 'Siap Diantar'},
  {id: 5, status: 'Sedang Diantar'},
  {id: 6, status: 'Sudah Diantar'},
  {id: 7, status: 'Pesanan Selesai'},
]

export const getStatus = code => {
  let statusOrder = '';
  switch (code) {
    case -1:
      statusOrder = 'Pesanan Dibatalkan oleh User';
      break;
    case 1:
      statusOrder = 'Menunggu Konfirmasi';
      break;
    case 2:
      statusOrder = 'Pesanan Ditolak';
      break;
    case 3:
      statusOrder = 'Pesanan Diterima';
      break;
    case 4:
      statusOrder = 'Siap Diantar';
      break;
    case 5:
      statusOrder = 'Sedang Diantar';
      break;
    case 6:
      statusOrder = 'Sudah Diantar';
      break;
    case 7:
      statusOrder = 'Pesanan Selesai';
      break;
  }
  return statusOrder;
};