import React from "react";
import { Asset } from "expo-asset";
import { manipulateAsync } from "expo-image-manipulator";
import { symbol } from "../../../utils/printSymbol";

//TO GET ASSET FROM DEVICE MEMORY
const copyFromAssets = async (asset) => {
  try {
    const [{ localUri }] = await Asset.loadAsync(asset);
    return localUri;
  } catch (error) {
    console.log(error);
  }
};

//CONVERT LocalUri to base64
const processLocalImage = async (imageUri) => {
  try {
    const uriParts = imageUri.split(".");
    const formatPart = uriParts[uriParts.length - 1];
    let format;

    if (formatPart.includes("png")) {
      format = "png";
    } else if (formatPart.includes("jpg") || formatPart.includes("jpeg")) {
      format = "jpeg";
    }

    const { base64 } = await manipulateAsync(imageUri, [], {
      format: format || "png",
      base64: true,
    });

    return `data:image/${format};base64,${base64}`;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const applyBadgeCol = (status, type) => {
  switch (type) {
    case "background":
      const bgColor =
        status === "failed"
          ? "rgba(235, 87, 87, 0.2)"
          : status === "processing"
          ? "rgba(226, 185, 59, 0.2)"
          : "rgba(39, 174, 96, 0.1)";
      return bgColor;

    case "text":
      const textColor =
        status === "failed"
          ? "#eb5757"
          : status === "processing"
          ? "#e2b93b"
          : "#27ae60";
      return textColor;
  }
};
const formatAmount = (amount, currencySymbol) => {
  const formatNumber = new Intl.NumberFormat("en-US").format(amount);
  return `${symbol(currencySymbol)}${formatNumber}`;
};

export const receiptHTML = async (
  status,
  typeOfTransaction,
  filteredReceipt,
  currency
) => {
  try {
    const asset = require("../../../assets/images/fullIcon.jpg");
    let src = await copyFromAssets(asset);
    src = await processLocalImage(src);
    return `<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="widp=device-widp; initial-scale=1.0" />
    <title>divansaction Receipt</title>
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap");
       @page { margin: 3rem; } 
      body {
        padding: 1.5rem;
      }
      .confirmationBox {
        background-color: #fff;
        border-radius: 20px;
        padding: 1.5rem 1rem 0;
      }

      .confirmationBox_top {
        padding: 0rem;
        display: flex;
        flex-direction: column;
      }

      .confirmationBox_top_imgContainer_wrapper {
         display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
      .confirmationBox_top_imgContainer {
        display: flex;
        flex-direction: row;
        align-items: center;
      }
      .shareWrapper {
        width: 30px;
        height: 30px;
        border-radius: 15px;
        background-color: #f4f5f6;
        align-items: center;
        justify-content: center;
        margin-right: 15px;
      }
      .cudiumText {
        font-family: "Inter", sans-serif;
        color: #28374b;
        font-size: 18px;
        font-weight: 700;
        padding-left: 15px;
      }

      .userImage {
        width: 50px;
        height: 50px;
        border-radius: 100px;
      }

      .badge {
        background-color: rgba(39, 174, 96, 0.1);
        padding: 10px 20px;
        border-radius: 20px;
        align-self: flex-start;
        margin-top: 20px;
        width: auto;
      }

      .badgeText {
        font-family: "Inter", sans-serif;
        font-size: 12px;
        font-weight: 700;
        color: #27ae60;

        text-transform: capitalize;
      }

      .confirmationBox_content {
        width: 100%;
        margin-top: 10px;
        margin-right: 0;
      }

      .list {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
        justify-content: space-between;
      }

      .key {
        font-family: "Inter", sans-serif;
        font-weight: 600;
        color: #c9cdd2;
        font-size: 12px;
        line-height: 1.2;
         width: 40%;
      }

      .value {
        font-family: "Inter", sans-serif;
        font-weight: 600;
        color: #5e6978;
        font-size: 12px;
        line-height: 1.2;
        text-transform: capitalize;
        width:60%;
        flex-wrap: wrap;
      }

      .totalAmount {
        font-family: "Inter", sans-serif;
        font-weight: 700;
        font-size: 18px;
        color: #27ae60;
      }
      .footer {
        color: #c9cdd2;
        font-family: "Inter", sans-serif;
        font-size: 10px;
        font-style: normal;
        font-weight: 500;
        line-height: 16px;
      }
      .footer-link {
        color: #3772ff;
      }
    </style>
  </head>
  <body>
    <div class="confirmationBox">
      <header class="confirmationBox_top">
        <div class="confirmationBox_top_imgContainer_wrapper">
          <div class="confirmationBox_top_imgContainer">
            <img
              src=${src}
              alt="logo"
              class="userImage"
            />

            <h1 class="cudiumText">Cudium</h1>
          </div>
          <h3 class="cudiumText">Transaction Receipt</h3>
        </div>
        <div class="badge" style= "background-color: ${applyBadgeCol(
          status,
          "background"
        )};">
          <span class="badgeText" style="color: ${applyBadgeCol(
            status,
            "text"
          )};"
            >${typeOfTransaction} ${status}</span
          >
        </div>
      </header>
      <div class="confirmationBox_content">
        ${filteredReceipt
          .map(
            (el) =>
              `<React.Fragment  key=${el.id}>
            <div
                  class="list"
                 
                >
                  <p class="key">${el.key}</p>

                  ${
                    el.key === "Total"
                      ? `<p class="value totalAmount">
                                    ${formatAmount(el.value, currency)}
                                  </p>`
                      : el.key === "Amount"
                      ? `<p class="value"> ${formatAmount(
                          el.value,
                          currency
                        )}</p>`
                      : `<p
                              class="value"
                              >
                                ${el.value || "-"}
                              </p>`
                  }
                </div>
            </React.Fragment>`
          )
          .join("")}
    </div>
    <p class="footer">
      If you have any information or would like more information, please, send
      an email to <a href = "mailto:admin@cudium.com" class="footer-link">admin@cudium.com</a> or call:
      <a href = "tel:070663227209" class="footer-link">070663227209</a>
    </p>
  </body>
</html>
`;
  } catch (error) {
    console.log("pdf generation error", error);
  }
};
