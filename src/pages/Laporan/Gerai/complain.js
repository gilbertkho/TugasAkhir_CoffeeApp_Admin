/* eslint-disable */
import React, { Fragment, useState, useEffect, useRef } from 'react';

import { useHistory } from 'react-router-dom';
import {
  Card, CardTitle, CardBody, Button, Modal, ModalHeader,
  ModalBody, ModalFooter, Row, Col, Label, Input, Table
} from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import axios from "config/axios";
import moment from "moment";
import urlConfig from "config/backend";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast, Zoom } from 'react-toastify';
import Errormsg from 'config/errormsg';
import getApiKey from 'config/getApiKey';

export default function ListPendaftar() {

  const history = useHistory();
  const [users, setUsers] = useState([]);  
  let [totalSize, setTotal] = useState(0);
  let [page, setPage] = useState(1);
  const sizePerPage = 10;
  const searchRef = useRef();
  const [apikey, setApikey] = useState('');
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');
  const [param, setParam] = useState({
    page: 1,
    count: sizePerPage,
    search: '',
    time_start: '',
    time_end: '',
    apikey: '',
  });

  const [toDelete, setToDelete] = useState(false);
  const [selected, setSelected] = useState({});
  const [period, setPeriod] = useState([]);
  const toggleDelete = (user) => {
    setToDelete(!toDelete);
    setSelectedUser(user)
  };

  const toEditUser = (user) => history.push('/master/gerai/edit', { user: user });

  const [modal, setModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});

  const toggle = () => { setModal(!modal) };
  const toggleEdit = (user) => { setModal(!modal); setSelectedUser(user) };

  // useEffect(() => { console.log(totalSize) }, [totalSize]);

  const GetActionFormat = (cell, row) => {
    console.log(row);
    return (
      <div>
        <Button color="primary" className="mr-2" size="sm" onClick={(e) => { e.stopPropagation(); toggleEdit(row) }}>
          <FontAwesomeIcon icon={['fa', 'info-circle']} />
        </Button>
        {/* <Button color="primary" className="mr-2" size="sm" onClick={(e) => { e.stopPropagation(); toEditUser(row) }}>
          <FontAwesomeIcon icon={['fa', 'edit']} />
        </Button>
        <Button color="primary" className="mr-2" size="sm" onClick={(e) => { e.stopPropagation(); sendVerification(row) }}>
          <FontAwesomeIcon icon={['fa', 'envelope']} />
        </Button> */}
        {/* <Button color="danger" className="mr-2" size="sm" onClick={(e) => { e.stopPropagation(); toggleDelete(row) }}>
          <FontAwesomeIcon icon={['fa', 'trash-alt']} />
        </Button> */}
      </div>
    );
  }

  const setNumberFormat = (cell,row) =>{
    if(row.total_harga){
      return (
        <>{addCommas(row.total_harga)}</>
      )
    }    
  }

  const timeFormat = (cell,row) =>{
    let date = new Date(row.tgl_pesanan);    
    return(
      <>
        {moment(row.tgl_pesanan).format('DD MMM YYYY, H:mm')}
      </>
    )
  }

  const statusPesanan  = (cell,row) => {
    return(
      <>
        {row.status_pesanan === 'DIPROSES' ? 
            <p className = 'text-warning m-0 font-weight-bold'>{row.status_pesanan}</p> 
          : row.status_pesanan === 'SELESAI' ?        
            <p className = 'text-success m-0 font-weight-bold'>{row.status_pesanan}</p> 
          : <p className = 'text-info m-0 font-weight-bold'>{row.status_pesanan}</p>
        } 
      </>
    )
  }

  const statusKomplain = (cell,row) => {
    return(
      <>
        {row.status_komplain === 'RESOLVED'?      
        <p className ='m-0'>Komplain Terselesaikan</p>
        :
        <p className ='m-0'>Komplain Dalam Proses Resolusi</p>
        }
      </>
    )
  }

  const addCommas = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const columns = [{
    dataField: 'action',
    text: 'Action',
    formatter: GetActionFormat,
    headerStyle: (column, colIndex) => {
      return { width: '100px' };
    }
  }, {
    dataField: 'nama',
    text: 'Nama Gerai'
  }, {
    dataField: 'nama_pelanggan',
    text: 'Nama Pelanggan'
  },{
    dataField: 'isi_komplain',
    text: 'Komplain'
  },{
    dataField: 'waktu_pesanan',
    text: 'Tanggal Pesanan',
    formatter : timeFormat
  },{
    dataField: 'status_pesanan',
    text: 'Status Pesanan',
    formatter: statusPesanan
  },{
    dataField: 'status_komplain',
    text: 'Status Komplain',
    formatter: statusKomplain
  }];

  const selectRow = {
    mode: 'checkbox',
    clickToSelect: true,
    hideSelectAll: true,
    selectColumnStyle: { width: 40 },
    onSelect: (row, isSelect, rowIndex, e) => {
      // console.log(row.id);
      // console.log(isSelect);
      // console.log(rowIndex);
      // console.log(e);
    },
  };

  function fetchData(param) { 
    console.log(param)
    axios.post('/app/admin/report/gerai/detail/complain', param).then(({data}) => {
        console.log(data)
        if (data.status) {
          setTotal(parseInt(data.total));
          setUsers(data.data);
        } else {
          toast.error(data.msg, { containerId: 'B', transition: Zoom });
        }
      }).catch(error => {        
        if(error.response.status != 500){
          toast.error(error.response.data.msg, {containerId:'B', transition: Zoom});
        }        
        else{
          toast.error(Errormsg['500'], {containerId: 'B', transition: Zoom});        
        }
      })
  }

  useEffect(() => {
    getApiKey().then((key) => {
      if(key.status){
        setApikey(key.key);
        setParam({...param, apikey: key.key});
      }
    })    
  },[])

  useEffect(() => {
    if(param.apikey !== ''){
      fetchData(param)
    }
  }, [param]);

  const handleTableChange = (type, { page, sizePerPage }) => {
    setParam((prevState) => ({
      ...prevState,
      page: page
    }))
  }

  const clearSearch = () => {
    setTimeStart('');
    setTimeEnd('');
    setParam((prevState) => ({ ...prevState, page: 1, time_start: '', time_end: '' }));    
  }

  const setTimeFilter = (e,val) => {
    if(val === "ts"){
      setTimeStart(e.target.value)      
    }
    else{
      setTimeEnd(e.target.value)     
    }
    console.log(e.target.value)
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if(Date.parse(timeStart) >  Date.parse(timeEnd)){
      toast.error('Tanggal berlaku tidak boleh melebihi tanggal berakhir', { containerId: 'B', transition: Zoom });
    }
    else{      
      setParam((prevState) => ({ ...prevState, page: 1, search: searchRef.current.value, time_start: timeStart, time_end: timeEnd, apikey: apikey }));
    }    
  }

  return (
    <>
      <Modal zIndex={2000} centered isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Detail Pesanan</ModalHeader>
        <ModalBody>
          <Row>
            <Col xs={4}>ID Pesanan</Col>
            <Col xs={8}>{": " + selectedUser.id_pesanan}</Col>
          </Row>
          <Row>
            <Col xs={4}>Nama Pelanggan</Col>
            <Col xs={8}>{": " + selectedUser.nama_pelanggan}</Col>
          </Row>
          <Row>
            <Col xs={4}>Tanggal Pesanan</Col>
            <Col xs={8}>{": " + moment(selectedUser.tgl_pesanan).format('DD MMMM YYYY, H:mm')}</Col>
          </Row>
          <Row>
            <Col xs={4}>Jumlah Pesanan</Col>
            <Col xs={8}>{": " + selectedUser.total_pesanan}</Col>
          </Row>
          <Row>
            <Col xs={4}>Total Harga</Col>
            <Col xs={8}>{modal ? ": " + addCommas(selectedUser.total_harga) : ": " + selectedUser.total_harga}</Col>
          </Row>
          <Row>
            <Col xs={4}>Pengambilan</Col>
            <Col xs={8}>{": " + selectedUser.tipe_pengambilan}</Col>
          </Row>
          <Row>
            <Col xs={4}>Biaya Delivery</Col>
            <Col xs={8}>{modal ? ": " + addCommas(selectedUser.biaya_delivery): ": " + selectedUser.biaya_delivery}</Col>
          </Row>
          <Row>
            <Col xs={4}>Voucher</Col>
            <Col xs={8}>{": " + (selectedUser.nama_voucher !== 'undefined' ? selected.nama_voucher : 'Tidak menggunakan voucher apapun' )}</Col>
          </Row>
          <Row>
            <Col xs={4}>Status Pesanan</Col>
            <Col xs={8}>{": " + selectedUser.status_pesanan}</Col>
          </Row>
          <Row>
            <Col xs={4}>Catatan Tambahan</Col>
            <Col xs={8}>{": " + selectedUser.catatan_tambahan}</Col>
          </Row>
          <Row className = 'p-3'>
              <Col className = 'border border-primary'>
                <p className = 'text-center'>Isi Komplain</p>
                <p className = 'text-justify'>{selectedUser.isi_komplain}</p>
              </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          {/* <Button color="primary" onClick={toggle}>Do Something</Button>{' '} */}
          <Button color="secondary" onClick={toggle}>Tutup</Button>
        </ModalFooter>
      </Modal>
      <Card>
        <CardBody>
          <CardTitle>Laporan Komplain</CardTitle>
          {/* <Button color = "primary" onClick = {() => {history.push('gerai/edit')} }>+ Tambah Gerai</Button> */}
            <div className = 'd-flex'>
              <div className = "w-50">
                <Label for = "time_start">Mulai Dari</Label>
                <Input id = "time_start" type="date" value = {timeStart} onChange = {(e) => setTimeFilter(e,"ts")}/>
              </div>
              <div className = "w-50 pl-3">
                <Label for = "time_end">Hingga</Label>
                <Input id = "time_end" type="date" value = {timeEnd} onChange = {(e) => setTimeFilter(e,"te")}/>
              </div>
            </div>
            {
              timeStart !== '' || timeEnd !== '' ? 
              <Button onClick={clearSearch} color="info" className="mt-2">
                <FontAwesomeIcon icon={['fas', 'trash-alt']} />
                <span style={{ marginLeft: 10 }}>
                  Clear
                </span>
              </Button>
              : null
            }
          <div className="my-2">
            <Label>Search</Label>
            <Input className="m-0" type="search" placeholder="Nama" innerRef={searchRef} />
            <Button onClick={handleSearch} color="primary" className="mt-2">
              <FontAwesomeIcon icon={['fas', 'search']} />
              <span style={{ marginLeft: 10 }}>
                Cari
              </span>
            </Button>
          </div>
          <BootstrapTable
            remote
            keyField='id_tipe'
            data={users}
            columns={columns}
            // selectRow={selectRow}
            bodyClasses="bootstrap-table"
            pagination={paginationFactory({
              hideSizePerPage: true,
              hidePageListOnlyOnePage: true,
              page: param.page,
              sizePerPage,
              totalSize
            })}
            onTableChange={handleTableChange}
            noDataIndication="Belum ada gerai"
            wrapperClasses="table-responsive"
          />
        </CardBody>
      </Card>
    </>
  );
}
