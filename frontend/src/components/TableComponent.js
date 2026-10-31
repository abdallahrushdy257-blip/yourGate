import React, { useState, useEffect, useRef, useCallback } from "react";
import Title from "./title";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField } from "@mui/material";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faPlus,
  faPrint,
  faX,
  faFileExcel,
  faInbox,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import PrintHead from "./PrintHead";
import PrintFooter from "./PrintFooter";
import API from "../api/axiosConfig";
import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router";
import "react-datepicker/dist/react-datepicker.css";
import "./Tablestyle.css";
import { TableSkeleton } from "./Skeleton";

function TableComponent({
  extraTitleField,
  apiUrl,
  columns,
  titleIcon,
  data: localData,
  title,
  transformRowFn,
  dropdownOptions = [],
  search,
  searchDate,
  searchTextProp,
  id,
  refreshDataProp,
  triggerReload,
  placeholderSearch,
  addBtn,
  onAddClick,
  addBtnName,
}) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [searchFrom, setSearchFrom] = useState(null);
  const [searchTo, setSearchTo] = useState(null);
  const [perPage, setPerPage] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const navigate = useNavigate();
  const [totalAmount, setTotalAmount] = useState(0);

  const handleNavigate = (route, rowId) => {
    navigate(route.replace(":id", rowId));
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchText]);

  const getNestedValue = (obj, path) => {
    return path
      .split(".")
      .reduce((acc, key) => (acc && acc[key] ? acc[key] : null), obj);
  };

  const isFetchingRef = useRef(false);
  const abortControllerRef = useRef(null);
  const prevTriggerReloadRef = useRef(triggerReload);

  const fetchData = useCallback(
    async (targetPage = 1, isReset = false) => {
      if (!apiUrl || localData) return;
      if (!isReset && isFetchingRef.current) return;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      isFetchingRef.current = true;
      if (isReset || targetPage === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const response = await API.post(
          apiUrl,
          {
            perpage: perPage,
            page: targetPage,
            search: debouncedSearchText,
            searchfrom: searchFrom ? dayjs(searchFrom).format("YYYY-MM-DD") : "",
            searchto: searchTo ? dayjs(searchTo).format("YYYY-MM-DD") : "",
            id: id ?? "",
            refreshData: refreshData,
          },
          { signal: controller.signal }
        );

        if (!response || !response.data) {
          throw new Error("Failed to fetch data");
        }

        const json = response.data;
        const records =
          Array.isArray(json) && Array.isArray(json[0])
            ? json[0]
            : Array.isArray(json)
            ? json
            : Array.isArray(json?.data)
            ? json.data
            : [];

        if (Array.isArray(records)) {
          setData((prevData) => {
            if (isReset || targetPage === 1) return records;
            const existingIds = new Set(prevData.map((r) => r.id));
            const uniqueNew = records.filter((r) => !existingIds.has(r.id));
            return [...prevData, ...uniqueNew];
          });
          setTotalRecords((prev) => (isReset || targetPage === 1 ? records.length : prev + records.length));
          setHasMore(records.length >= perPage && records.length > 0);

          const sumAmount = records.reduce(
            (acc, record) => acc + (parseFloat(record.amount) || 0),
            0,
          );
          setTotalAmount(sumAmount);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        if (
          error?.name !== "CanceledError" &&
          error?.name !== "AbortError" &&
          error?.code !== "ERR_CANCELED"
        ) {
          console.error("Error fetching data:", error);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
        isFetchingRef.current = false;
      }
    },
    [apiUrl, localData, perPage, debouncedSearchText, searchFrom, searchTo, id, refreshData],
  );

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // 1. Handle localData if provided
  useEffect(() => {
    if (localData) {
      setData(localData);
      setTotalRecords(localData.length);
    }
  }, [localData]);

  // 2. Fetch on initial mount or when search filters change (resets to page 1)
  useEffect(() => {
    if (localData) return;
    setPage(1);
    fetchData(1, true);
  }, [apiUrl, debouncedSearchText, searchFrom, searchTo, id, refreshData, fetchData, localData]);

  // 3. Fetch when page increases (Load More) without resetting
  useEffect(() => {
    if (page > 1) {
      fetchData(page, false);
    }
  }, [page, fetchData]);

  // 4. Handle triggerReload from parent (modal save / delete)
  useEffect(() => {
    if (triggerReload !== undefined && triggerReload !== prevTriggerReloadRef.current) {
      prevTriggerReloadRef.current = triggerReload;
      isFetchingRef.current = false;
      setPage(1);
      fetchData(1, true);
    }
  }, [triggerReload, fetchData]);

  const totalPages = Math.ceil(totalRecords / perPage);
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePrint = () => {
    window.print();
  };
  
  const handleExportExcel = () => {
    import("xlsx").then((xlsx) => {
      const ws = xlsx.utils.json_to_sheet(
        data.map((record, index) => {
          const row = {};
          row["#"] = index + 1;
          columns.forEach((col) => {
            if (col.key !== "actions") {
              row[col.name] = record[col.key];
            }
          });
          return row;
        }),
      );
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, "Data");
      xlsx.writeFile(wb, `${title || "Export"}.xlsx`);
    });
  };

  //  const handleExportPDF = async () => {
  //   const { default: jsPDF } = await import("jspdf");
  //   const { default: autoTable } = await import("jspdf-autotable");

  //   const doc = new jsPDF({
  //     orientation: "portrait",
  //     unit: "mm",
  //     format: "a4",
  //   });

  //   doc.text(title || "Report", 14, 10);

  //   const tableColumn = [
  //     "#",
  //     ...columns.filter((c) => c.key !== "actions").map((c) => c.name),
  //   ];

  //   const tableRows = data.map((record, i) => [
  //     i + 1,
  //     ...columns
  //       .filter((c) => c.key !== "actions")
  //       .map((c) => record[c.key]),
  //   ]);

  //   // ✅ الاستدعاء الصحيح في الإصدار الحديث:
  //   autoTable(doc, {
  //     head: [tableColumn],
  //     body: tableRows,
  //     startY: 20,
  //     styles: { fontSize: 9 },
  //   });

  //   doc.save(`${title || "Report"}.pdf`);
  // };

  return (
    <>
      <div className="printTabel-container">
        <div className="printCalc">
          {/* <Title title={title} icon={titleIcon} style={{ width: "unset" }} classname='rmtit' /> */}
          {/* <Title
            title={
              <>
                {extraTitleField && data.length > 0 && (
                  <>{getNestedValue(data[0], extraTitleField)} - </>
                )}
                {title}
              </>
            }
            icon={titleIcon}
            style={{ width: "unset" }}
            classname="rmtit"
          /> */}
          <Title
            title={
              <>
                {title}
                {extraTitleField && data.length > 0 && (
                  <>
                    {" "}
                    {title.length > 0 && " - "}
                    {extraTitleField !== "description"
                      ? getNestedValue(data[0], extraTitleField)
                      : getNestedValue(data[0], extraTitleField).match(
                          /from \[(.*?)\]/,
                        )[1]}
                  </>
                )}
              </>
            }
            icon={titleIcon}
            style={{ width: "unset" }}
            classname="rmtit"
          />

          <div className="newContainer">
            <div
              className="actions-container newactions-container"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                flexWrap: "wrap",
                marginBottom: "15px",
                marginTop: "15px",
              }}
            >
              <div
                className="left-side-actions"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                {search !== false && (
                  <div
                    className="search-container"
                    style={{
                      position: "relative",
                      display: "inline-flex",
                      alignItems: "center",
                      width: "auto",
                      minWidth: "240px",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faMagnifyingGlass}
                      className="search-input-icon"
                    />
                    {searchTextProp !== false && (
                      <input
                        placeholder={
                          placeholderSearch ? placeholderSearch : "البحث"
                        }
                        value={searchText}
                        onChange={(e) => {
                          setSearchText(e.target.value);
                          setPage(1);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            setDebouncedSearchText(searchText);
                          }
                        }}
                        className="search-input styled-search-button"
                        style={{
                          width: "100%",
                          paddingLeft: searchText ? "36px" : "16px",
                          paddingRight: "38px",
                          height: "42px",
                        }}
                      />
                    )}

                    {searchText && (
                      <button
                        type="button"
                        className="clear-button"
                        onClick={() => {
                          setSearchText("");
                          setPage(1);
                        }}
                        style={{
                          position: "absolute",
                          left: "12px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          padding: "4px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--text-color, #777)",
                          fontSize: "13px",
                        }}
                        title="مسح"
                      >
                        <FontAwesomeIcon icon={faX} />
                      </button>
                    )}
                  </div>
                )}

                {searchDate !== false && (
                  <>
                    <div className="date-container">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="من"
                          format="DD-MM-YYYY"
                          value={searchFrom}
                          onChange={(date) => {
                            setSearchFrom(date);
                            setPage(1);
                          }}
                          slotProps={{
                            textField: {
                              size: "small",
                              placeholder: "DD-MM-YYYY",
                            },
                          }}
                          className="cus-input"
                        />
                      </LocalizationProvider>
                      {searchFrom && (
                        <button
                          type="button"
                          className="clear-button date-clear-button"
                          onClick={() => {
                            setSearchFrom(null);
                            setPage(1);
                          }}
                          title="مسح التاريخ"
                        >
                          <FontAwesomeIcon icon={faX} />
                        </button>
                      )}
                    </div>
                    <div className="date-container">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="إلى"
                          format="DD-MM-YYYY"
                          value={searchTo}
                          onChange={(date) => {
                            setSearchTo(date);
                            setPage(1);
                          }}
                          slotProps={{
                            textField: {
                              size: "small",
                              placeholder: "DD-MM-YYYY",
                            },
                          }}
                          className="cus-input"
                        />
                      </LocalizationProvider>
                      {searchTo && (
                        <button
                          type="button"
                          className="clear-button date-clear-button"
                          onClick={() => {
                            setSearchTo(null);
                            setPage(1);
                          }}
                          title="مسح التاريخ"
                        >
                          <FontAwesomeIcon icon={faX} />
                        </button>
                      )}
                    </div>
                  </>
                )}

                {addBtn && (
                  <button
                    type="button"
                    className="add-row-ta archiveAdd"
                    onClick={onAddClick}
                  >
                    <FontAwesomeIcon icon={faPlus} /> إضافة {addBtnName || ""}
                  </button>
                )}
              </div>

              <div
                className="export-buttons"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <button
                  className="styled-download-button"
                  onClick={handlePrint}
                >
                  <FontAwesomeIcon icon={faPrint} />
                </button>

                <button
                  className="styled-download-button"
                  onClick={handleExportExcel}
                  title="تصدير Excel"
                >
                  <FontAwesomeIcon
                    icon={faFileExcel}
                    style={{ color: "green" }}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* <div>
                    <select
                        className="search-input styled-search-button rowsdrop"
                        value={perPage}
                        onChange={(e) => {
                            setPerPage(Number(e.target.value));
                            setPage(1);
                        }}
                    >
                        <option value={10}>10 صفوف</option>
                        <option value={25}>25 صفوف</option>
                        <option value={50}>50 صفوف</option>
                        <option value={100}>100 صفوف</option>
                    </select>
                </div> */}
        </div>
        <div className="table-scroll">
          <div className="no-screen print-only">
            <PrintHead title={title} />
          </div>
          <table className="printTabel printContainer">
            <thead>
              <tr className="printTabelHead selected-row">
                <th>م</th>
                {columns.map((column, colIndex) => (
                  <th
                    key={column.key || colIndex}
                    className={column.key === "actions" ? "no-print" : ""}
                  >
                    {column.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && data.length === 0 ? (
                <TableSkeleton
                  rows={perPage > 8 ? 8 : perPage || 6}
                  columns={columns.length + 1}
                />
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    style={{
                      textAlign: "center",
                      padding: "50px 20px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "10px",
                        color: "var(--text-color, #999)",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faInbox}
                        style={{
                          fontSize: "2.5rem",
                          opacity: 0.4,
                          color: "var(--primary-color, #c29a64)",
                        }}
                      />
                      <span style={{ fontSize: "15px", fontWeight: "600" }}>
                        لا توجد بيانات متاحة
                      </span>
                      <span style={{ fontSize: "13px", opacity: 0.7 }}>
                        لم يتم العثور على أي نتائج مطابقة للشروط المحددة
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((record, rowIndex) => {
                  const transformedRecord = transformRowFn
                    ? transformRowFn(record)
                    : record;
                  return (
                    <tr key={record.id || rowIndex} className="selected-row">
                      <td>{rowIndex + 1}</td>
                      {columns.map((column, colIndex) => (
                        <td
                          key={column.key || colIndex}
                          data-label={column.name}
                          className={column.key === "actions" ? "no-print" : ""}
                        >
                          {column.key === "actions" ? (
                            <Dropdown className="table-un-printable-ellipse">
                              <Dropdown.Toggle
                                variant="secondary"
                                size="sm"
                                className="no-caret-dropdown rm-back"
                              >
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                {dropdownOptions
                                  .filter(
                                    (option) =>
                                      !option.visibleIf ||
                                      option.visibleIf(record),
                                  )
                                  .map((option, idx) => (
                                    <Dropdown.Item
                                      key={idx}
                                      onClick={(e) => {
                                        if (e && e.stopPropagation) e.stopPropagation();
                                        if (option.action) {
                                          option.action(record.id, record);
                                        } else if (option.route) {
                                          handleNavigate(
                                            option.route,
                                            record.id,
                                          );
                                        }
                                      }}
                                    >
                                      {option.label}
                                    </Dropdown.Item>
                                  ))}
                              </Dropdown.Menu>
                            </Dropdown>
                          ) : transformedRecord[column.key] !== undefined ? (
                            <span
                              dangerouslySetInnerHTML={{
                                __html: transformedRecord[column.key],
                              }}
                            />
                          ) : (
                            "N/A"
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
            <tfoot>
              {totalAmount > 0 && columns.some((c) => c.key === "amount") && (
                <tr className=" selected-row">
                  <td
                    colSpan={columns.findIndex((c) => c.key === "amount") + 1}
                    style={{
                      textAlign: "start",
                      fontWeight: "bold",
                      padding: "10px",
                    }}
                  >
                    الإجمالي:
                  </td>
                  <td
                    colSpan={
                      columns.filter((c) => c.key !== "actions").length -
                      columns.findIndex((c) => c.key === "amount")
                    }
                    style={{ fontWeight: "bold", textAlign: "center" }}
                  >
                    {totalAmount.toLocaleString()} ريال
                  </td>
                </tr>
              )}
            </tfoot>
          </table>
          <div className="no-screen print-only">
            <PrintFooter />
          </div>
        </div>
      </div>
      {hasMore && data.length > 0 && (
        <div className="tablepagination-container">
          <button
            className="page-button btn btn-secondary mt-3"
            onClick={() => handlePageChange(page + 1)}
            disabled={loadingMore}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 22px",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: "600",
              border: "none",
            }}
          >
            {loadingMore ? (
              <>
                <div
                  className="spinner-border spinner-border-sm"
                  role="status"
                  style={{ width: "1rem", height: "1rem" }}
                />
                <span>جاري التحميل...</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faPlus} />
                <span>تحميل المزيد</span>
              </>
            )}
          </button>

          {/* <span className="align-self-center">
                        صفحة {page} من {totalPages}
                    </span>
                    
                    <button
                        className="page-button"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                    >
                        السابق
                    </button> */}
        </div>
      )}
      {/* <PrintFooter /> */}
    </>
  );
}

export default TableComponent;
