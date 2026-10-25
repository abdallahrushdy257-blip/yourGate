import React , {useEffect} from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
 
  return (
    <>
    <div class="error">404</div>
<br /><br />
<span class="info">Page not found</span>
<img src="http://images2.layoutsparks.com/1/160030/too-much-tv-static.gif" class="static" />

      {/* <Link to="/home" className="btn btn-primary">
        العودة إلى الرئيسية
      </Link> */}
    </>
  );
}
