import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faFilter,
  faCloudArrowDown,
  faEllipsisVertical,
  faPlus,
  faBan,
  faEye,
  faPrint,
  faReceipt,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Dropdown, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import RegisterTextbox from "./RegisterTextBox";
import Title from "./title";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

function CustomTable({
  columns,
  data,
  onDownload,
  dropdownOptions,
  add,
  filters,
  total,
  search,
  addTitle,
  title,
  titleIcon,
  rowsPerPage = 5,
  navto,
  goTo
}) {
  const [rows, setRows] = useState(data);
  const [filteredRows, setFilteredRows] = useState(data);
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showInputForm, setShowInputForm] = useState(false);
  const [newRowData, setNewRowData] = useState({});
  const [Statefilters, setStateFilters] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const hasDateColumn = columns.some((col) => /^date/i.test(col.key));
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

  const getCurrentPageRows = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredRows.slice(startIndex, endIndex);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const filterRowsByDate = (start, end) => {
    const today = new Date();

    let filtered = rows.filter((row) => {
      return columns.some((col) => {
        if (/^date/i.test(col.key) && row[col.key]) {
          const rowDate = new Date(row[col.key]);

          if (start && !end) {
            return rowDate >= new Date(start) && rowDate <= today;
          } else if (!start && end) {
            return rowDate <= new Date(end);
          } else if (start && end) {
            return rowDate >= new Date(start) && rowDate <= new Date(end);
          }

          return true;
        }
        return false;
      });
    });

    setFilteredRows(filtered);
    setCurrentPage(1);
  };

  const handleDateChange = (setter, value) => {
    setter(value);
    filterRowsByDate(
      setter === setFromDate ? value : fromDate,
      setter === setToDate ? value : toDate
    );
  };

  const filterRowsByName = (query) => {
    const lowercasedQuery = query.toLowerCase();
    const filtered = rows.filter((row) =>
      row.name?.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredRows(filtered);
    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    filterRowsByName(query);
  };

  const handleSelectRow = (rowId) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(rowId)
        ? prevSelected.filter((id) => id !== rowId)
        : [...prevSelected, rowId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === getCurrentPageRows().length) {
      setSelectedRows([]);
    } else {
      const allRowIds = getCurrentPageRows().map((row) => row.id);
      setSelectedRows(allRowIds);
    }
  };
  const sortRows = (option, order) => {
    const sortedRows = [...filteredRows].sort((a, b) => {
      const valueA = a[option];
      const valueB = b[option];

      if (typeof valueA === "string") {
        return order === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else if (valueA instanceof Date) {
        return order === "asc" ? valueA - valueB : valueB - valueA;
      } else {
        return 0;
      }
    });

    setFilteredRows(sortedRows);
    setCurrentPage(1);
  };

  const handleSortOption = (option) => {
    if (option === sortOption) {
      const newOrder = sortOrder === "asc" ? "desc" : "asc";
      setSortOrder(newOrder);
      sortRows(option, newOrder);
    } else {
      setSortOption(option);
      setSortOrder("asc");
      sortRows(option, "asc");
    }
  };

  const handleNavigate = (route, rowId) => {
    navigate(route.replace(":id", rowId));
  };

  const handleAddRowClick = () => {
    setShowInputForm(true);
    setNewRowData({});
  };

  const handleInputChange = (key, value) => {
    setNewRowData((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddRowSubmit = () => {
    const isValid = columns
      .filter((col) => col.key !== "id" && col.key !== "actions")
      .every((col) => newRowData[col.key] && newRowData[col.key].trim() !== "");

    if (!isValid) {
      alert("Please fill in all the fields.");
      return;
    }

    const newRow = { id: rows.length + 1, ...newRowData };
    setRows((prevRows) => [...prevRows, newRow]);
    setShowInputForm(false);
  };

  useEffect(() => {
    if (filters === false) {
      setStateFilters(filters);
    }
  }, [filters]);

  useEffect(() => {
    setFilteredRows(rows);
    setCurrentPage(1);
  }, [rows]);

  const totalDonations = filteredRows.reduce((sum, row) => {
    const value = parseFloat(row.totalCost || 0);
    return sum + value;
  }, 0);

  // const handleDeleteRow = (rowId) => {
  //   const updatedRows = rows.filter((row) => row.id !== rowId);
  //   setRows(updatedRows);
  //   setFilteredRows(updatedRows);
  // };

  const handleShowModal = () => {
    setShowModal(true);
    setNewRowData({});
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handlePrint = () => {
    document.body.classList.add("print-mode");
    window.print();
    document.body.classList.remove("print-mode");
  };



  return (
    <>
      <div className="printTabel-container">
        <Title title={title} icon={titleIcon} style={{ width: "unset" }} />
        <div className="actions-container">
          <button className="styled-download-button" onClick={handlePrint}>
            <FontAwesomeIcon icon={faPrint} />
          </button>
          {Statefilters && (
            <>
              <Dropdown>
                <Dropdown.Toggle
                  variant="primary"
                  id="filters-dropdown"
                  className="custom-dropdown filterBtn"
                  style={{ marginRight: "30px" }}
                >
                  <FontAwesomeIcon icon={faFilter} />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {
                    columns.map((col, index) => (

                      <Dropdown.Item
                        key={index}
                        onClick={() => handleSortOption(col.key)}
                      >
                        ترتيب بحسب {col.name}
                      </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
              </Dropdown>

              {sortOption && (
                <button
                  className="styled-sort-button"
                  onClick={() => handleSortOption(sortOption)}
                >
                  {sortOrder === "asc" ? (
                    <FontAwesomeIcon icon={faArrowUp} />
                  ) : (
                    <FontAwesomeIcon icon={faArrowDown} />
                  )}
                </button>
              )}

              <button
                className="styled-download-button"
                onClick={() => onDownload(selectedRows)}
              >
                <FontAwesomeIcon icon={faCloudArrowDown} />
              </button>
            </>
          )}
          {search && (
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="بحث"
              className="search-input styled-search-button"
            />
          )}
          {hasDateColumn && (
            <div className="date-filter-container">
              <div className="date-container">
                {/* <p className="pnomargin">من</p> */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  {/* <DatePicker
                    label="DD-MM-YYYY"
                    format="DD-MM-YYYY"
                    value={fromDate ? dayjs(fromDate) : null}
                    onChange={(newValue) => {
                      const selectedFromDate = newValue
                        ? newValue.format("YYYY-MM-DD")
                        : null;
                      setFromDate(selectedFromDate);
                      filterRowsByDate(selectedFromDate, toDate);
                    }}
                    renderInput={(params) => (
                      <input {...params} className="styled-date-input" />
                    )}
                  /> */}
                  <DatePicker
                    label="من"
                    format="DD-MM-YYYY"
                    value={fromDate ? dayjs(fromDate) : null}
                    onChange={(newValue) => {
                      const selectedFromDate = newValue
                        ? newValue.format("YYYY-MM-DD")
                        : null;
                      setFromDate(selectedFromDate);
                      filterRowsByDate(selectedFromDate, toDate);
                    }}
                    renderInput={(params) => (
                      <input {...params} className="styled-date-input" />
                    )}
                  />
                </LocalizationProvider>
              </div>
              <div className="date-container">
                {/* <p className="pnomargin">الي</p> */}

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  {/* <DatePicker
                    label="DD-MM-YYYY"
                    value={toDate ? dayjs(toDate) : null}
                    onChange={(newValue) => {
                      const selectedToDate = newValue
                        ? newValue.format("YYYY-MM-DD")
                        : null;
                      setToDate(selectedToDate);
                      filterRowsByDate(fromDate, selectedToDate);
                    }}
                    format="DD-MM-YYYY"
                    renderInput={(params) => (
                      <input {...params} className="styled-date-input" />
                    )}
                  /> */}
                  <DatePicker
                    label="إلى"
                    format="DD-MM-YYYY"
                    value={toDate ? dayjs(toDate) : null}
                    onChange={(newValue) => {
                      const selectedToDate = newValue
                        ? newValue.format("YYYY-MM-DD")
                        : null;
                      setToDate(selectedToDate);
                      filterRowsByDate(fromDate, selectedToDate);
                    }}
                    renderInput={(params) => (
                      <input {...params} className="styled-date-input" />
                    )}
                  />
                </LocalizationProvider>
              </div>
            </div>
          )}
          {add && (
            <button
              className="styled-download-button"
              onClick={handleShowModal}
            >
              إضافة {addTitle} <FontAwesomeIcon icon={faPlus} />
            </button>
          )}

          {goTo && (
            <button
              className="styled-download-button"
              onClick={() => navigate(`/${goTo}`)}
            >
              <FontAwesomeIcon icon={faPlus} />  {addTitle}
            </button>
          )}
        </div>

        {showModal && (
          <Modal
            show={showModal}
            onHide={handleCloseModal}
            centered
            className="modal"
          >
            <Modal.Header closeButton>
              <Modal.Title>إضافة {addTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {columns
                .filter((col) => col.key !== "id" && col.key !== "actions")
                .map((col, index) => (
                  <div key={index} className="form-group">
                    <RegisterTextbox
                      parentStyle={{ width: "100%" }}
                      id={col.key}
                      label={col.name}
                      type={col.type}
                      value={newRowData[col.key] || ""}
                      onChange={(e) =>
                        handleInputChange(col.key, e.target.value)
                      }
                    />
                  </div>
                ))}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                إغلاق
              </Button>
              <Button variant="primary" onClick={handleAddRowSubmit}>
                إضافة
              </Button>
            </Modal.Footer>
          </Modal>
        )}

        <div className="table-scroll">
          <table className="printTabel">
            <thead>
              <tr className="printTabelHead selected-row">
                <th>
                  م
                </th>
                {columns.map((col, index) => (
                  <th key={index} className={`table${col.key}`}>
                    {col.name}
                  </th>
                ))}
{/* 
                <th className="selectTable">
                  <input
                    type="checkbox"
                    className="minus-checkbox"
                    onChange={handleSelectAll}
                    checked={
                      selectedRows.length === getCurrentPageRows().length
                    }
                    indeterminate={
                      selectedRows.length > 0 &&
                      selectedRows.length < getCurrentPageRows().length
                    }
                  />
                  <div className="minuscontainer"></div>
                </th> */}
              </tr>
            </thead>
            <tbody>
              {getCurrentPageRows().map((row, index) => (
                <tr
                  key={row.id}
                  className={
                    selectedRows.includes(row.id) ? "selected-row" : ""
                  }

                >
                  {/* // td to charto */}
                  <td data-label="م" className="tableindex">
                    {index + 1 + (currentPage - 1) * rowsPerPage}
                  </td>
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} data-label={col.name}>
                      {col.key === "actions" ? (
                        <Dropdown>
                          <Dropdown.Toggle
                            variant="secondary"
                            size="sm"
                            className="no-caret-dropdown rm-back"
                          >
                            <FontAwesomeIcon icon={faEllipsisVertical} />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {dropdownOptions.map((option, idx) => (
                              <Dropdown.Item
                                key={idx}
                                onClick={() =>
                                  handleNavigate(option.route, row.id)
                                }
                              >
                                {option.label}
                              </Dropdown.Item>
                            ))}
                            {/* <Dropdown.Item
                          onClick={() => handleDeleteRow(row.id)}
                          style={{ color: "red" }}
                        >
                          حذف
                        </Dropdown.Item> */}
                          </Dropdown.Menu>
                        </Dropdown>
                      ) : col.key === "status" ? (
                        <span
                          style={{
                            backgroundColor:
                              row[col.key] === "مكتمل"
                                ? "#0FF52A66"
                                : row[col.key] === "تم جزئيا"
                                  ? "#FFC10766"
                                  : "#F53D0F66",
                            padding: "3px 10px",
                            borderRadius: "20px",
                            color: "var(--text-color)",
                            width: "90px",
                            display: "inline-block",
                          }}
                        >
                          {row[col.key]}
                        </span>
                      ) : col.key === "files" ? (
                        row.status === "مكتمل" || row.status === "تم جزئيا" ? (
                          <Link
                            to={`/designattachments`}
                            style={{ textDecoration: "underline" }}
                            className="designshowbutton"
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </Link>
                        ) : (
                          <span style={{ color: "red" }}>
                            <FontAwesomeIcon icon={faBan} />{" "}
                          </span>
                        )
                      ) : row[col.key] !== undefined ? (
                        row[col.key]
                      ) : (
                        "N/A"
                      )}
                    </td>
                  ))}
                  {/* <td data-label="Select" className="disabledSelect">
                    <input
                      type="checkbox"
                      className="minus-checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleSelectRow(row.id)}
                    />
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        <div className="tablepagination-container">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="page-button"
          >
            <FontAwesomeIcon icon={faAngleRight} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`page-button ${currentPage === page ? "active" : ""}`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="page-button"
          >
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>
        </div>

        {total && (
          <div
            className="total-donations-container"
            style={{
              marginTop: "20px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            إجمالي التبرعات: {totalDonations} ريال سعودي
          </div>
        )}
      </div >
    </>
  );
}

export default CustomTable;
