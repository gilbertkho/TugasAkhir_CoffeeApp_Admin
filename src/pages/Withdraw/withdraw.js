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
import { S } from 'react-ladda/dist/constants';
import getApiKey from 'config/getApiKey';

export default function Withdraw() {

  const history = useHistory();
  const [users, setUsers] = useState([]);
  let [totalSize, setTotal] = useState(0);
  let [page, setPage] = useState(1);
  const sizePerPage = 10;
  const searchRef = useRef();
  const [param, setParam] = useState({
    page: 1,
    count: sizePerPage,
    search: '',
    apikey: '',
  });

  const [toDelete, setToDelete] = useState(false);
  const [selected, setSelected] = useState({});
  const [period, setPeriod] = useState([]);
  const toggleDelete = (user) => {
    setToDelete(!toDelete);
    setSelectedUser(user)
  };

  const toEditUser = (user) => history.push('/subscription/edit', { user: user });

  const [modal, setModal] = useState(false);
  const [modalAsk, setModalAsk] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});

  const toggle = () => { setModal(!modal) };
  const toggleAsk = () => { setModalAsk(!modalAsk)};
  const toggleEdit = (user) => { setModal(!modal); setSelectedUser(user) };
  const toggleComplete = (user) => {setModalAsk(!modalAsk); setSelectedUser(user)};

  // useEffect(() => { console.log(totalSize) }, [totalSize]);

  const addCommas = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const GetActionFormat = (cell, row) => {
    console.log(row);
    return (
      <div>
        <Button color="primary" className="mr-2" size="sm" onClick={(e) => { e.stopPropagation(); toggleEdit(row) }}>
          <FontAwesomeIcon icon={['fa', 'info-circle']} />
        </Button>
        <Button color="primary" className="mr-2" size="sm" onClick={(e) => { e.stopPropagation(); toggleComplete(row) }} disabled = {row.status_penarikan === 'COMPLETED' ? true : false}>
          <FontAwesomeIcon icon={['fa', 'check']} />
        </Button>
        {/* <Button color="danger" className="mr-2" size="sm" onClick={(e) => { e.stopPropagation(); toggleDelete(row) }}>
          <FontAwesomeIcon icon={['fa', 'trash-alt']} />
        </Button> */}
      </div>
    );
  }

  const timeFormat = (cell,row) => {       
    if(row.tgl_penarikan){
      return(
        <>
          {moment(row.tgl_penarikan).format("DD MMMM YYYY, HH:mm")}
        </>
      )
    }
  }

  const moneyFormat = (cell,row) => {
    return(
      <>{'Rp.' + addCommas(row.jumlah_penarikan)}</>
    )
  }

  const statusFormat = (cell,row) => {
    if(row.status_penarikan === 'REQUESTED')
    return(     
      <strong className = "text-warning">{row.status_penarikan}</strong>
    )
    else
    return(
      <strong className = "text-success">{row.status_penarikan}</strong>
    )    
  }

  const columns = [{
    dataField: 'action',
    text: 'Action',
    formatter: GetActionFormat,
    headerStyle: (column, colIndex) => {
      return { width: '150px' };
    }
  }, {
    dataField: 'nama',
    text: 'Nama Gerai'
    
  },{
    dataField: 'bank',
    text: 'Bank'    
  },{
    dataField: 'no_rek',
    text: 'Nomor Rekening'
  },{
    dataField: 'tgl_penarikan',
    text: 'Tanggal Penarikan',
    formatter: timeFormat
  },{
    dataField: 'jumlah_penarikan',
    text: 'Jumlah Penarikan',
    formatter: moneyFormat
  },{
    dataField: 'status_penarikan',
    text: 'Status Penarikan',
    formatter: statusFormat
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
    axios.post('/app/admin/gerai/withdraw', param).then(({data}) => {
      if (data.status) {
          console.log(data)
          setTotal(parseInt(data.total))
          setUsers(data.data)
        } else {
          toast.error(data.msg, { containerId: 'B', transition: Zoom });
        }
      }).catch(error => {
        console.log(error.response)
        if(error.response){
          toast.error(error.response.data.msg, {containerId:'B', transition: Zoom});
        }
        else{
          toast.error(Errormsg['500'], {containerId: 'B', transition: Zoom});        
        }
      })
  }

  const setWithdrawCompleted = (row) => {
    axios.post('app/admin/gerai/withdraw/complete',{id_penarikan: row.id_penarikan, apikey: param.apikey}).then(({data}) => {
      if(data.status){
        fetchData(param)
        toggleAsk;
        toast.success('Penarikan dana berhasil dikirim ke rekening gerai', {containerId:'B', transition: Zoom});
      } else {
        toast.error(data.msg, { containerId: 'B', transition: Zoom });    
      }
    }).catch(error => {
    console.log(error.response)
      if(error.response){
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
        setParam({...param, apikey: key.key});
      }
    })
  })

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

  const handleSearch = (e) => {
    e.preventDefault()
    setParam((prevState) => ({ ...prevState, page: 1, search: searchRef.current.value }))
  }

  return (
    <>
      <Modal zIndex={2000} centered isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Detail Penarikan</ModalHeader>
        <ModalBody>
          <Row>
            <Col xs={4}>ID Penarikan</Col>
            <Col xs={8}>{": " + selectedUser.id_penarikan}</Col>
          </Row>
          <Row>
            <Col xs={4}>Nama Gerai</Col>
            <Col xs={8}>{": " + selectedUser.nama}</Col>
          </Row>
          <Row>
            <Col xs={4}>Bank</Col>
            <Col xs={8}>{": " + selectedUser.bank}</Col>
          </Row>
          <Row>
            <Col xs={4}>Nomor Rekening</Col>
            <Col xs={8}>{": " + selectedUser.no_rek}</Col>
          </Row>
          <Row>
            <Col xs={4}>Tanggal Penarikan</Col>
            <Col xs={8}>{": " + moment(selectedUser.tgl_penarikan).format('DD MMMM YYYY, h:mm')}</Col>
          </Row>
          <Row>
            <Col xs={4}>Jumlah Penarikan</Col>
            <Col xs={8}>: {selectedUser.jumlah_penarikan ? 'Rp.' + addCommas(selectedUser.jumlah_penarikan) : null}</Col>
          </Row>
          <Row>
            <Col xs={4}>Status Penarikan</Col>
            <Col xs={8}>{": " + selectedUser.status_penarikan}</Col>
          </Row>          
        </ModalBody>
        <ModalFooter>
          {/* <Button color="primary" onClick={toggle}>Do Something</Button>{' '} */}
          <Button color="secondary" onClick={toggle}>Tutup</Button>
        </ModalFooter>
      </Modal>
      <Modal zIndex={2000} centered isOpen={modalAsk} toggle={toggleAsk}>
      <ModalHeader toggle={toggleAsk}>Apakah proses pengiriman dana telah berhasil dilakukan?</ModalHeader>        
        <ModalBody>
          <Row>
            <Col xs={4}>ID Penarikan</Col>
            <Col xs={8}>{": " + selectedUser.id_penarikan}</Col>
          </Row>
          <Row>
            <Col xs={4}>Nama Gerai</Col>
            <Col xs={8}>{": " + selectedUser.nama}</Col>
          </Row>
          <Row>
            <Col xs={4}>Bank</Col>
            <Col xs={8}>{": " + selectedUser.bank}</Col>
          </Row>
          <Row>
            <Col xs={4}>Nomor Rekening</Col>
            <Col xs={8}>{": " + selectedUser.no_rek}</Col>
          </Row>
          <Row>
            <Col xs={4}>Tanggal Penarikan</Col>
            <Col xs={8}>{": " + moment(selectedUser.tgl_penarikan).format('DD MMMM YYYY, h:mm')}</Col>
          </Row>
          <Row>
            <Col xs={4}>Jumlah Penarikan</Col>
            <Col xs={8}>: {selectedUser.jumlah_penarikan ? 'Rp.' + addCommas(selectedUser.jumlah_penarikan) : null}</Col>
          </Row>
          <Row>
            <Col xs={4}>Status Penarikan</Col>
            <Col xs={8}>{": " + selectedUser.status_penarikan}</Col>
          </Row>          
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => { setWithdrawCompleted(selectedUser)}}>Complete</Button>{' '}
          <Button color="secondary" onClick={toggleAsk}>Tutup</Button>
        </ModalFooter>
      </Modal>
      <Card>
        <CardBody>
          <CardTitle>Permintaan Penarikan Dana</CardTitle>
          {/* <Button color = "primary" onClick = {() => {history.push('gerai/edit')} }>+ Tambah Gerai</Button> */}
          <div className="my-2">
            <Label>Search</Label>
            <Input className="m-0" type="search" placeholder="Nama gerai" innerRef={searchRef} />
            <Button onClick={handleSearch} color="primary" className="mt-2">
              <FontAwesomeIcon icon={['fas', 'search']} />
              <span style={{ marginLeft: 10 }}>
                Cari
              </span>
            </Button>
          </div>
          <BootstrapTable
            remote
            keyField='id_subscription'
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
            noDataIndication="Belum ada pendaftar"
            wrapperClasses="table-responsive"
          />
        </CardBody>
      </Card>
    </>
  );
}
