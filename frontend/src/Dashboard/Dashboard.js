import {
  faCartShopping,
  faDollarSign,
  faGift,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import "./dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useContext } from "react";
import CircularProgressBar from "../components/CircularProgressBar";
import MyLineChart from "../components/Charts/LineChart";
import CustomButton from "../components/CustomButton";
import SimpleMyBarChart from "../components/Charts/SimpleBarChart";
import API from "../api/axiosConfig";
import { useEffect } from "react";
import TestPreloader from "../pages/TestPreLoader/TestPreLoader";
import { useNavigate } from "react-router-dom";
import BscDashboard from "../components/Bsc/BscDashboard";
import { AppContext } from "../context/AuthContext";

function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [showModal4, setShowModal4] = useState(false);
  const [showModal5, setShowModal5] = useState(false);
  const [profitPercentage, setProfitPercentage] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const Navigate = useNavigate();
  const { user } = useContext(AppContext);
  const getHomeData = async () => {
    setLoading(true);
    try {
      const res = await API.get("/home");
    const data = res;
    setData(data.data);
    } catch (error) {
      console.log(error)
    }finally{
     setLoading(false)
    }
  };
  useEffect(() => {
    getHomeData();
  }, []);

  // Line

  const xData11 = ["المتبقي", "المدفوع", "الإجمالي"];
  const seriesData11 = [
    (data?.totalloans || 0) - (data?.totalloanstransaction || 0),
    data?.totalloanstransaction ?? 0,
    data?.totalloans ?? 0,
  ];

  // Bar 2
  const seriesData2 = [
    data?.dontations_paid ?? 0,
    data?.dontains_recieved ?? 0,
  ];
  const xData2 = ["المدفوعات", "التبرعات"];

  //TODO: aviod loading more than once

  const columns = [
    { name: "", key: "id" },
    { name: "إسم القرض", key: "name" },
    { name: "إسم المستفيد", key: "case" },
    { name: "تاريخ الحصول", key: "date" },
    { name: "قيمة الإقتراض", key: "money" },
    { name: "الأقساط المسددة", key: "loans" },
  ];

  const columns2 = [
    { name: "", key: "id" },
    { name: "إسم العضو", key: "name" },
    { name: "نوع الإشتراك", key: "type" },
    { name: "قيمة الإشتراك", key: "val" },
    { name: "الحالة", key: "case" },
  ];
  const columns3 = [
    { name: "", key: "id" },
    { name: "إسم الحساب", key: "name" },
    { name: "القيمة ", key: "val" },
  ];

  const columns4 = [
    { name: "", key: "id" },
    { name: "إسم الحالة", key: "name" },
    { name: "تاريخ الإنشاء ", key: "date" },
    { name: "التبرعات ", key: "danations" },
    { name: "المتبقي ", key: "res" },
  ];

  const columns5 = [
    { name: "", key: "id" },
    { name: "إسم المشروع", key: "name" },
    { name: "تاريخ الإنشاء ", key: "date" },
    { name: "التبرعات ", key: "danations" },
    { name: "المتبقي ", key: "res" },
  ];
  useEffect(() => {
    if (data) {
      const percentage = (data.totaltransaction / data.totalshop) * 100;
      setProfitPercentage(percentage);
    }
  }, [data]);
  return loading ? (
    <TestPreloader />
  ) : (
    <>
      <div className="dashboard">
        <div className="dashcontent">
          <div className="con_cards">
            <div className="card_dashbord">
              <div className="card_icon" onClick={() => Navigate("/comeleave")}>
                <div className="doler">
                  <FontAwesomeIcon icon={faUsers} className="" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex20 flex201">
            <div className="con_cards">
              <div className="card_dashbord myShadow">
                <div className="card_dashbordTit">
                  <span className="spans_card">الحالات</span>
                </div>
                <div className="card_icon" onClick={() => setShowModal4(true)}>
                  <div className="doler">
                    <FontAwesomeIcon icon={faDollarSign} className="" />
                  </div>
                </div>
                <span className="">{data?.total_humancases}ر.س</span>
              </div>

              <div className="card_dashbord myShadow">
                <div className="card_dashbordTit">
                  <span className="spans_card"> المشاريع </span>
                </div>
                <div className="card_icon" onClick={() => setShowModal5(true)}>
                  <div className="doler">
                    <FontAwesomeIcon icon={faCartShopping} />
                  </div>
                </div>
                <span className="">{data?.total_projects}ر.س</span>
              </div>

              <div className="card_dashbord myShadow">
                <div className="card_dashbordTit">
                  <span className="spans_card"> النقدية المتوفرة</span>
                </div>
                <div className="card_icon" onClick={() => setShowModal3(true)}>
                  <div className="doler">
                    <FontAwesomeIcon icon={faGift} />{" "}
                  </div>
                </div>
                <span className="">{data?.totalstorecash}ر.س</span>
              </div>
            </div>

            <div className="big_card myShadow">
              <div className="text_big">
                <span> عدد الموظفين</span>
                <span>{data?.employees ?? 0}</span>
              </div>

              <div className="text_big">
                <span>المستفيدين</span>
                <span>{data?.humancases ?? 0} </span>
              </div>

              <div className="text_big">
                <span>المانحين </span>
                <span>{data?.donors ?? 0} </span>
              </div>
              <div className="text_big">
                <span onClick={() => setShowModal2(true)}>
                  الجمعية العمومية
                </span>
                <span>{(data?.boardmembers || 0) + (data?.assemblygeneral || 0)} </span>
              </div>
            </div>
          </div>

          <div className="flex20 flex2012">
            <div className="chart myShadow">
              <div className="lineChartHeadCon">
                <p className="linechartTit">استعراض التبرعات خلال السنه</p>
              </div>
              <div className="lineChart">
                <MyLineChart
                  xData={data?.donationchart?.map((item) => item.month)}
                  yData={data?.donationchart?.map((item) => item.total)}
                  width={600}
                  height={350}
                />
              </div>
            </div>

            <div className="chart chart2 myShadow">
              <div className="barChartOneCon">
                <div className="barsContent">
                  <div className="barDataContainer">
                    <span className="barData">
                      <h5 className="barDatatitle">المدفوع</h5>
                      <p className="barDatatitleVal">
                        ر.س{data?.totalloanstransaction ?? 0}
                      </p>
                    </span>
                    <span className="barData">
                      <h5 className="barDatatitle">المتبقي</h5>
                      <p className="barDatatitleVal">
                        ر.س{(data?.totalloans || 0) - (data?.totalloanstransaction || 0)}
                      </p>
                    </span>
                    <span className="barData">
                      <h5 className="barDatatitle">الإجمالي</h5>
                      <p className="barDatatitleVal">
                        ر.س{data?.totalloans ?? 0}
                      </p>
                    </span>
                  </div>

                  <CustomButton
                    text="التفاصيل"
                    className="addClientBtn"
                    onClick={() => setShowModal(true)}
                  />
                </div>
                <div className="barChart">
                  <div className="lineChart">
                    <SimpleMyBarChart
                      xData={xData11}
                      seriesData={seriesData11}
                      width={400}
                      height={350}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex20 flex203">
            <div className="dount myShadow">
              <SimpleMyBarChart
                xData={xData2}
                seriesData={seriesData2}
                width={600}
                height={350}
              />
            </div>

            <div className="dount conchartBar myShadow">
              <span className="spanss">التحصيل</span>
              <div className="donatDescContainer">
                <span className="donatdesc">
                  <span className="coloreddonatdesc2"></span>
                  محصل
                </span>
                <span className="donatdesc">
                  <span className="coloreddonatdesc"></span>
                  غير محصل
                </span>
              </div>
              <div className="cahrt_dount ">
                <CircularProgressBar
                  percentage={profitPercentage}
                  size={200}
                  strokeWidth={30}
                  bgColor="#00DBF8"
                  useGradient={true}
                  gradientStartColor="#468FEF"
                  gradientEndColor="#116269"
                  textColor="var(--text-color)"
                  shadowColor="rgba(0, 0, 0, 0.4)"
                  shadowOffsetY="6px"
                  shadowBlur="12px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="myShadow"
        style={{
          margin: "40px auto",
          borderRadius: "15px",
          padding: "20px",
          width: "80%",
        }}
      >
        <BscDashboard
          orgId={user && user.organization && user.organization.id}
        />
      </div>

      {/* <Modal
        className="add-subacc-modal dashModal"
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
      >
        <Modal.Header>
          <Button
            className="custom-close-button cls-btn"
            variant="link"
            onClick={() => setShowModal(false)}
          >
            <FontAwesomeIcon icon={faXmark} className="closeModal" />
          </Button>
          <Modal.Title className="title-sub">
            القروض والأقساط
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CustomTable
            columns={columns}
            data={[]}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            اغلاق
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        className="add-subacc-modal dashModal"
        show={showModal2}
        onHide={() => setShowModal2(false)}
        centered
      >
        <Modal.Header>
          <Button
            className="custom-close-button cls-btn"
            variant="link"
            onClick={() => setShowModal2(false)}
          >
            <FontAwesomeIcon icon={faXmark} className="closeModal" />
          </Button>
          <Modal.Title className="title-sub">
            اشتراكات مجلس الإدارة
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CustomTable
            columns={columns2}
            data={[]}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal2(false)}>
            اغلاق
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        className="add-subacc-modal dashModal"
        show={showModal3}
        onHide={() => setShowModal3(false)}
        centered
      >
        <Modal.Header>
          <Button
            className="custom-close-button cls-btn"
            variant="link"
            onClick={() => setShowModal3(false)}
          >
            <FontAwesomeIcon icon={faXmark} className="closeModal" />
          </Button>
          <Modal.Title className="title-sub">
            النقدية المتوفرة
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CustomTable
            columns={columns3}
            data={[]}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal3(false)}>
            اغلاق
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        className="add-subacc-modal dashModal"
        show={showModal4}
        onHide={() => setShowModal4(false)}
        centered
      >
        <Modal.Header>
          <Button
            className="custom-close-button cls-btn"
            variant="link"
            onClick={() => setShowModal4(false)}
          >
            <FontAwesomeIcon icon={faXmark} className="closeModal" />
          </Button>
          <Modal.Title className="title-sub">
            الحالات
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CustomTable
            columns={columns4}
            data={[]}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal4(false)}>
            اغلاق
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        className="add-subacc-modal dashModal"
        show={showModal5}
        onHide={() => setShowModal5(false)}
        centered
      >
        <Modal.Header>
          <Button
            className="custom-close-button cls-btn"
            variant="link"
            onClick={() => setShowModal5(false)}
          >
            <FontAwesomeIcon icon={faXmark} className="closeModal" />
          </Button>
          <Modal.Title className="title-sub">
            المشاريع
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CustomTable
            columns={columns5}
            data={[]}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal5(false)}>
            اغلاق
          </Button>
        </Modal.Footer>
      </Modal> */}
    </>
  );
}

export default Dashboard;
