import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ChartAdmin from './chartAdmin';
import axios from 'config/axios';
import { toast, Zoom } from 'react-toastify';
import { Row, Col, CardBody, Card } from 'reactstrap';
import Errormsg from 'config/errormsg';
import localforage from 'localforage';
import getApiKey from 'config/getApiKey';

class dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      apikey: '',
      customer: 0,
      gerai: 0,
      task: 0,
      menu: 0
    };
  }

  getData = async () => {
    let apikey = '';
    getApiKey().then((key) => {
      if(key.status){
        apikey = key.key;
        this.setState({apikey: key.key});
      }
    });
    try {
      apikey = await localforage.getItem('APIKEY');
    } catch (error) {
      console.log(error);
    }
    // let wave = this.state.wave;
    // let regdata = this.state.regdata;
    // let totalreg = this.state.totalreg;
    // console.log(regdata);
    await axios
      .post('/app/admin/dashboard', {
        apikey: apikey
      })
      .then(({ data }) => {
        if (data.status) {
          console.log(data);
          this.setState({
            gerai: data.data.total_gerai,
            customer: data.data.total_customer,
            menu: data.data.total_menu,
            subs: data.data.total_subs
          });
        } else {
          toast.error(data.msg, {
            containerId: 'B',
            transition: Zoom
          });
        }
      })
      .catch((error) => {
        if (error.response.status != 500) {
          toast.error(error.response.data.msg, {containerId:'B', transition: Zoom});
        } else {
          toast.error(Errormsg['500'], {containerId: 'B', transition: Zoom});
        }
    });   
  };

  componentDidMount() {
    this.getData();
  }

  render() {
    return (
      <>
        <div className="app-wrapper bg-white min-vh-100">
          <div className="app-main min-vh-100">
            <div className="app-content p-0">
              <div className="flex-grow-1 w-100 p-5">
                {/* <h1>{this.state.wave}</h1> */}
                {/* <h4 className="text-info">{"Total Pendaftaran: " + this.state.totalreg}</h4> */}
                <Row>
                  <Col lg="6" xl="6">
                    <Card className="card-box mb-5 bg-midnight-bloom border-0 text-light">
                      <CardBody>
                        <div className="align-box-row align-items-start">
                          <div className="font-weight-bold">
                            <small className="text-white-50 d-block mb-1 text-uppercase">
                              Total Gerai
                            </small>
                            <span className="font-size-xxl mt-1">
                              {this.state.gerai}
                            </span>
                          </div>
                          <div className="ml-auto">
                            <div className="bg-white text-center text-info font-size-xl d-50 rounded-circle btn-icon">
                              <FontAwesomeIcon icon={['fa', 'store']} />
                            </div>
                          </div>
                        </div>
                        {/* <div className="mt-3">
                          <FontAwesomeIcon icon={['fas', 'arrow-up']} className="text-success" />
                          <span className="text-success px-1">15.4%</span>
                          <span className="text-white-50">increase this month</span>
                        </div> */}
                      </CardBody>
                    </Card>
                  </Col>
                  <Col lg="6" xl="6">
                    <Card className="card-box mb-5 bg-midnight-bloom text-light">
                      <CardBody>
                        <div className="align-box-row align-items-start">
                          <div className="font-weight-bold">
                            <small className="text-white-50 d-block mb-1 text-uppercase">
                              Total Customer
                            </small>
                            <span className="font-size-xxl mt-1">
                              {this.state.customer}
                            </span>
                          </div>
                          <div className="ml-auto">
                            <div className="bg-white text-center text-info font-size-xl d-50 rounded-circle btn-icon">
                              <FontAwesomeIcon icon={['fa', 'users']} />
                            </div>
                          </div>
                        </div>
                        {/* <div className="mt-3">
                          <FontAwesomeIcon icon={['fas', 'arrow-up']} className="text-success" />
                          <span className="text-success px-1">12.65%</span>
                          <span className="text-white-50">same as before</span>
                        </div> */}
                      </CardBody>
                    </Card>
                  </Col>
                  {/* <Col lg="12" xl="4">
                    <Card className="card-box mb-5 bg-midnight-bloom text-white">
                      <CardBody>
                        <div className="align-box-row align-items-start">
                          <div className="font-weight-bold">
                            <small className="text-white-50 d-block mb-1 text-uppercase">Orders</small>
                            <span className="font-size-xxl mt-1">345</span>
                          </div>
                          <div className="ml-auto">
                            <div className="bg-white text-center text-danger font-size-xl d-50 rounded-circle btn-icon">
                              <FontAwesomeIcon icon={['far', 'keyboard']} />
                            </div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <FontAwesomeIcon icon={['fas', 'arrow-up']} className="text-warning" />
                          <span className="text-warning px-1">4.2%</span>
                          <span className="text-white-50">lower order numbers</span>
                        </div>
                      </CardBody>
                    </Card>
                  </Col> */}
                </Row>
                <Row>
                  <Col lg="6" xl="6">
                    <Card className="card-box mb-5 bg-midnight-bloom border-0 text-light">
                      <CardBody>
                        <div className="align-box-row align-items-start">
                          <div className="font-weight-bold">
                            <small className="text-white-50 d-block mb-1 text-uppercase">
                              Total Menu
                            </small>
                            <span className="font-size-xxl mt-1">
                              {this.state.menu}
                            </span>
                          </div>
                          <div className="ml-auto">
                            <div className="bg-white text-center text-info font-size-xl d-50 rounded-circle btn-icon">
                              <FontAwesomeIcon icon={['fa', 'utensils']} />
                            </div>
                          </div>
                        </div>
                        {/* <div className="mt-3">
                          <FontAwesomeIcon icon={['fas', 'arrow-up']} className="text-success" />
                          <span className="text-success px-1">15.4%</span>
                          <span className="text-white-50">increase this month</span>
                        </div> */}
                      </CardBody>
                    </Card>
                  </Col>
                  <Col lg="6" xl="6">
                    <Card className="card-box mb-5 bg-midnight-bloom border-0 text-light">
                      <CardBody>
                        <div className="align-box-row align-items-start">
                          <div className="font-weight-bold">
                            <small className="text-white-50 d-block mb-1 text-uppercase">
                              Total Langganan
                            </small>
                            <span className="font-size-xxl mt-1">
                              {this.state.subs}
                            </span>
                          </div>
                          <div className="ml-auto">
                            <div className="bg-white text-center text-info font-size-xl d-50 rounded-circle btn-icon">
                              <FontAwesomeIcon icon={['fa', 'calendar']} />
                            </div>
                          </div>
                        </div>
                        {/* <div className="mt-3">
                          <FontAwesomeIcon icon={['fas', 'arrow-up']} className="text-success" />
                          <span className="text-success px-1">15.4%</span>
                          <span className="text-white-50">increase this month</span>
                        </div> */}
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
                {/* <ChartAdmin regdata={this.state.regdata} /> */}
                {/* {
                this.state.notes.map((note,key)=>{
                  return(
                  <div key={key}>
                      tes
                    {note}
                  </div>
                  )
                })
              } */}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default dashboard;
