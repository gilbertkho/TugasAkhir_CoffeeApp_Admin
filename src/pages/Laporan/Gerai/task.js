/* eslint-disable */
import React, { Fragment, useState, useEffect, useRef } from 'react';

import { useHistory } from 'react-router-dom';
import {
  Card, CardTitle, CardBody, Button, Modal, ModalHeader,
  ModalBody, ModalFooter, Row, Col, Label, Input, Table, Breadcrumb, BreadcrumbItem
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

  const toReport = (user) => { history.push('/laporan/gerai/task/detail', { user: user }); }

  const GetActionFormat = (cell, row) => {
    console.log(row);
    return (
      <div>
        <Button color="primary" className="mr-2" size="sm" onClick={(e) => { e.stopPropagation(); toggleEdit(row) }}>
          <FontAwesomeIcon icon={['fa', 'info-circle']} />
        </Button>
        <Button color="primary" className="mr-2" size="sm" onClick={(e) => { e.stopPropagation(); toReport(row) }}>
          <FontAwesomeIcon icon={['fa', 'chart-line']} />
        </Button>
      </div>
    );
  }

  const setNumberFormatLevel = (cell,row) =>{    
    return (
      <>{addCommas(row.level_task)}</>
    )       
}

const setNumberFormatKuota = (cell,row) =>{    
  return (
    <>{addCommas(row.kuota_task)}</>
  )       
}

const timeStartFormat = (cell,row) =>{
  let date = new Date(row.time_start);    
  return(
    <>
      {date.getDate()+ " " + date.toLocaleDateString('default',{month:'long'}) +" "+ date.getFullYear()}
    </>
  )
}

const timeEndFormat = (cell,row) =>{
  let date = new Date(row.time_end);    
  return(
    <>
      {date.getDate()+ " " + date.toLocaleDateString('default',{month:'long'}) +" "+ date.getFullYear()}
    </>
  )
}

const statusFormat = (cell,row) => {    
  return(
    <>
      {row.status_task === 'NONAKTIF' ? 
        <p className = 'text-warning m-0 font-weight-bold'>{row.status_task}</p> 
        :
        <p className = 'text-success m-0 font-weight-bold'>{row.status_task}</p> 
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
      return { width: '180px' };
    }
  }, {
    dataField: 'nama',
    text: 'Nama Gerai'
  }, {
    dataField: 'level_task',
    text: 'Level',
    formatter: setNumberFormatLevel
  }, {
    dataField: 'kuota_task',
    text: 'Kuota',
    formatter: setNumberFormatKuota
  }, {
    dataField: 'time_start',
    text: 'Tanggal Berlaku',
    formatter: timeStartFormat,
  }, {
    dataField: 'time_end',
    text: 'Tanggal Berakhir',
    formatter: timeEndFormat,
  }, {
    dataField: 'status_task',
    text: 'Status',
    formatter: statusFormat,    
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
    axios.post('/app/admin/report/gerai/detail/task', param).then(({data}) => {
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
        <ModalHeader toggle={toggle}>Detail Task</ModalHeader>
        <ModalBody>
          <Row>
            <Col xs={4}>ID Task</Col>
            <Col xs={8}>{": " + selectedUser.id_task }</Col>
          </Row>
          <Row>
            <Col xs={4}>Level</Col>
            <Col xs={8}>{modal ? ": " + addCommas(selectedUser.level_task) : ": " + selectedUser.level_task}</Col>
          </Row>
          <Row>
            <Col xs={4}>Kuota</Col>
            <Col xs={8}>{modal ? ": " + addCommas(selectedUser.kuota_task) : ": " + selectedUser.kuota_task}</Col>
          </Row>          
          <Row>
            <Col xs={4}>Tanggal Berlaku</Col>
            <Col xs={8}>{": " + moment(selectedUser.time_start).format('DD-MM-YYYY')}</Col>
          </Row>
          <Row>
            <Col xs={4}>Tanggal Berakhir</Col>
            <Col xs={8}>{": " + moment(selectedUser.time_end).format('DD-MM-YYYY')}</Col>
          </Row>          
          <Row>
            <Col xs={4}>Status</Col>
            <Col xs={8}>{": " + selectedUser.status_task}</Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          {/* <Button color="primary" onClick={toggle}>Do Something</Button>{' '} */}
          <Button color="secondary" onClick={toggle}>Tutup</Button>
        </ModalFooter>
      </Modal>
      <Card>
        <CardBody>
          {/* <CardTitle>Laporan Task</CardTitle> */}
          <Breadcrumb>
            <BreadcrumbItem><a href="/#" onClick={(e) => { e.preventDefault(); history.push('/laporan/gerai') }}>Laporan</a></BreadcrumbItem>
            <BreadcrumbItem active>Task</BreadcrumbItem>
          </Breadcrumb>
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
