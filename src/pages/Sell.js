import { Box, TextField, Button } from '@mui/material';
import { useState } from 'react';
import Caver from 'caver-js';
import axios from 'axios';

import GT_ADDRESS from '../contractInfo/GTCONTRACT/ADDRESS.json';
import GT_ABI from '../contractInfo/GTCONTRACT/ABI.json';
import TS_ADDRESS from '../contractInfo/TSCONTRACT/ADDRESS.json';
import TS_ABI from '../contractInfo/TSCONTRACT/ABI.json';

const Sell = () => {
  const caver = new Caver(window.klaytn);
  const GTCONTRACT = new caver.klay.Contract(GT_ABI, GT_ADDRESS);
  const TSCONTRACT = new caver.klay.Contract(TS_ABI, TS_ADDRESS);

  const [tokenId, setTokenId] = useState('');
  const [price, setPrice] = useState(0);

  const approve = async () => {
    const { rawTransaction: senderRawTransaction } = await caver.klay.signTransaction({
      type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
      from: window.klaytn.selectedAddress,
      to: GT_ADDRESS,
      data: GTCONTRACT.methods.setApprovalForAll(TS_ADDRESS, true).encodeABI(),
      gas: '5000000',
      value: caver.utils.toPeb('0', 'KLAY'),
    });
    axios
      .post('http://localhost:5000/fee-delegated', {
        transaction: senderRawTransaction,
      })
      .then((res) => console.log(res.data));
  };

  const cancelApprove = async () => {
    const { rawTransaction: senderRawTransaction } = await caver.klay.signTransaction({
      type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
      from: window.klaytn.selectedAddress,
      to: GT_ADDRESS,
      data: GTCONTRACT.methods.setApprovalForAll(TS_ADDRESS, false).encodeABI(),
      gas: '5000000',
      value: caver.utils.toPeb('0', 'KLAY'),
    });

    axios
      .post('http://localhost:5000/fee-delegated', {
        transaction: senderRawTransaction,
      })
      .then((res) => console.log(res.data));
  };
  const sellNFT = async () => {
    const _sid = parseInt(tokenId, 10);
    const { rawTransaction: senderRawTransaction } = await caver.klay.signTransaction({
      type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
      from: window.klaytn.selectedAddress,
      to: TS_ADDRESS,
      data: TSCONTRACT.methods.setForSale(_sid, caver.utils.toPeb(price, 'KLAY')).encodeABI(),
      gas: '500000',
      value: caver.utils.toPeb('0', 'KLAY'),
    });

    axios
      .post('http://localhost:5000/fee-delegated', {
        transaction: senderRawTransaction,
      })
      .then((res) => console.log(res.data));
  };

  const cancelSellNFT = async () => {
    const _sid = parseInt(tokenId, 10);
    const value = [_sid];
    const { rawTransaction: senderRawTransaction } = await caver.klay.signTransaction({
      type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
      from: window.klaytn.selectedAddress,
      to: TS_ADDRESS,
      data: TSCONTRACT.methods.removeTokenOnSale(value).encodeABI(),
      gas: '500000',
      value: caver.utils.toPeb('0', 'KLAY'),
    });

    axios
      .post('http://localhost:5000/fee-delegated', {
        transaction: senderRawTransaction,
      })
      .then((res) => console.log(res.data));
  };

  return (
    <>
      <Button onClick={() => approve(tokenId)}>??????????????? ?????? ?????? ????????????</Button>
      <br />
      <Button onClick={() => cancelApprove(tokenId)}>??????????????? ?????? ?????? ?????? ????????????</Button>
      <br />
      <TextField id="tokenId" variant="outlined" label="?????? ?????????" onChange={(e) => setTokenId(e.target.value)} />
      <TextField id="price" variant="outlined" label="??????(KLAY)" onChange={(e) => setPrice(e.target.value)} />
      <br />

      <Button onClick={() => sellNFT(tokenId)}>?????? ????????????</Button>
      <br />
      <Button onClick={() => cancelSellNFT(tokenId)}>?????? ?????? ????????????</Button>
    </>
  );
};

export default Sell;
