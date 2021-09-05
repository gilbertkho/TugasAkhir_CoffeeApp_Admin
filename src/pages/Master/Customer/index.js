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
        <Button color="primary" className="mr-2" size="sm" onClick={(e) => { e.stopPropagation(); toEditUser(row) }}>
          <FontAwesomeIcon icon={['fa', 'edit']} />
        </Button>
        <Button color="primary" className="mr-2" size="sm" onClick={(e) => { e.stopPropagation(); sendVerification(row) }}>
          <FontAwesomeIcon icon={['fa', 'envelope']} />
        </Button>
        {/* <Button color="danger" className="mr-2" size="sm" onClick={(e) => { e.stopPropagation(); toggleDelete(row) }}>
          <FontAwesomeIcon icon={['fa', 'trash-alt']} />
        </Button> */}
      </div>
    );
  }

  const sendVerification = (row) => {
    toast.info('Sedang mengirim email verifikasi', {containerId:'B', transition:Zoom, autoClose:5000});
    axios.post('/app/admin/verify/request', {
      email: row.email,
      apikey: param.apikey,
      tipe_user: 'CUSTOMER'
    }).then(({data}) => {
      if(data.status){
        toast.success(data.msg, {containerId:'B', transition:Zoom});
      } 
      else {
        toast.error(data.msg, { containerId: 'B', transition: Zoom });
      }
    }).catch((error) => {      
      if(error.response.status != 500){
        toast.error(error.response.data.msg, {containerId:'B', transition: Zoom});
      }
      else{
        toast.error(Errormsg['500'], {containerId: 'B', transition: Zoom});        
      }
    })
  }


  const statusFormat = (cell,row) => {
    if(row.status_gerai === 'AKTIF'){
      return <p className = 'text-success font-weight-bold m-0'>{row.status_gerai}</p>
    }
    else{
      return <p className = 'text-warning font-weight-bold m-0'>{row.status_gerai}</p>
    }
  }

  const statusVerifikas = (cell, row) => {
    if(row.verified === 'TRUE'){
      return <p className = 'text-info font-weight-bold m-0'>Verified</p>
    }
    else{
      return <p className = 'text-danger font-weight-bold m-0'>Unverified</p>
    }
  }

  const columns = [{
    dataField: 'action',
    text: 'Action',
    formatter: GetActionFormat,
    headerStyle: (column, colIndex) => {
      return { width: '210px' };
    }
  }, {
    dataField: 'nama',
    text: 'Nama'
  },{
    dataField: 'alamat',
    text: 'Alamat'
  },{
    dataField: 'no_telp',
    text: 'Nomor Telepon'
  },{
    dataField: 'email',
    text: 'Email'
  },{
    dataField: 'verified',
    text: 'Verifikasi',
    formatter: statusVerifikas
  },];

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
    axios.post('/app/admin/customer', param).then(({data}) => {
        console.log(data.data)
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

  const deleteHandler = async () => {
    toast.dismiss();
    axios.post('app/admin/gerai/delete', {id_tipe: selectedUser.id_tipe}).then(({data}) => {
        if (data.status) {
          // if (page == 1) {
          //   fetchData(1, sizePerPage);
          // } else {
          //   setPage(1);
          // }
          toast.success(data.msg, {containerId:"B", transition:Zoom});
          fetchData(param);
          toggleDelete({});
        }
        else{
          toast.error(data.msg, {containerId:"B", transition:Zoom});
        }
      })
    .catch(error => { 
      if(error.response.status != 500){
        toast.error(error.response.data.msg, {containerId:'B', transition: Zoom});
      }        
      else{
        toast.error(Errormsg['500'], {containerId: 'B', transition: Zoom});        
      }      
    })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setParam((prevState) => ({ ...prevState, page: 1, search: searchRef.current.value }))
  }

  return (
    <>
      <Modal zIndex={2000} centered isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Detail Customer</ModalHeader>
        <ModalBody>
          <Row>
            <Col xs={4}>Nama</Col>
            <Col xs={8}>{": " + selectedUser.nama}</Col>
          </Row>
          <Row>
            <Col xs={4}>Alamat</Col>
            <Col xs={8}>{": " + selectedUser.alamat}</Col>
          </Row>
          <Row>
            <Col xs={4}>Nomor Telepon</Col>
            <Col xs={8}>: {selectedUser.no_telp}</Col>
          </Row>
          <Row>
            <Col xs={4}>Email</Col>
            <Col xs={8}>{": " + selectedUser.email}</Col>
          </Row>          
          <Row>
            <Col xs={4}>Verifikasi</Col>
            <Col xs={8}>{": " + (selectedUser.verified === 'TRUE' ? 'Verified' : 'Unverified')}</Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          {/* <Button color="primary" onClick={toggle}>Do Something</Button>{' '} */}
          <Button color="secondary" onClick={toggle}>Tutup</Button>
        </ModalFooter>
      </Modal>
      <Card>
        <CardBody>
          <CardTitle>Daftar Customer</CardTitle>
          {/* <Button color = "primary" onClick = {() => {history.push('gerai/edit')} }>+ Tambah Gerai</Button> */}
          <div className="my-2">
            <Label>Search</Label>
            <Input className="m-0" type="search" placeholder="Nama, Alamat, Nomor telepon, Email" innerRef={searchRef} />
            <Button onClick={handleSearch} color="primary" className="mt-2">
              <FontAwesomeIcon icon={['fas', 'search']} />
              <span style={{ marginLeft: 10 }}>
                Cari
              </span>
            </Button>
          </div>
          <BootstrapTable
            remote
            keyField='id_customer'
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
            noDataIndication="Belum ada customer"
            wrapperClasses="table-responsive"
          />
        </CardBody>
      </Card>
    </>
  );
}
