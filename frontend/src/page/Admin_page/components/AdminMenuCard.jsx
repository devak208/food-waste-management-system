import { useContext, useEffect, useState } from "react";
import Popup from "./PopupComponents/popup";
import DataContextAdmin from "../../Context/DataContextAdmin";
import { FaRupeeSign } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export const AdminMenuCard = ({ item }) => {
  const allergensList = [
    "Gluten",
    "Milk",
    "Eggs",
    "Nuts",
    "Peanuts",
    "Soybeans",
    "Fish",
    "Crustaceans",
    "Molluscs",
    "Celery",
    "Lupin",
    "Sesame",
    "Mustard",
    "Sulphites",
    "None",
  ];

  const {
    handleEditItem,
    handleDeleteItem,
    isProductEditPopupVisible,
    handleClosePopup,
    editFoodName,
    editFoodExists,
    foodPrice,
    foodveg_non_veg,
    foodcategory,
    foodQuantity,
    foodTotal,
    foodIngredients,
    foodAllergens,
    setEditFoodName,
    setFoodPrice,
    setFoodveg_non_veg,
    setfoodcategory,
    setFoodQuantity,
    setFoodTotal,
    setFoodAllergens,
    setFoodIngredients,
    handleEditClick,
    invalidQuantity,
    deleteloading,
    deletebut,
    editloding,
    editbut,
    selectedAllergens,
    setSelectedAllergens,
  } = useContext(DataContextAdmin);

  const [isdeletepopupVisible, setdeletepopupVisible] = useState(false);

  const handledeleteClosePopup = () => {
    setdeletepopupVisible(false);
  };

  // Handle checkbox changes
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;

    setSelectedAllergens((prevState) => {
      if (checked) {
        return [...prevState, value]; // Add allergen
      } else {
        return prevState.filter((allergen) => allergen !== value); // Remove allergen
      }
    });
  };

  useEffect(() => {
    if (isProductEditPopupVisible) {
      // Synchronize selected allergens with the food item allergens when the popup opens
      if (foodAllergens && foodAllergens.trim() !== "") {
        const allergensArray = foodAllergens
          .split(", ")
          .map((allergen) => allergen.trim());
        setSelectedAllergens(allergensArray);
      } else {
        setSelectedAllergens([]);
      }
    }
  }, [isProductEditPopupVisible, foodAllergens, setSelectedAllergens]);

  // Ensure that allergens are updated in the context when selected allergens change
  useEffect(() => {
    setFoodAllergens(selectedAllergens.join(", "));
  }, [selectedAllergens, setFoodAllergens]);

  return (
    <div className="bg-white rounded-md p-2 basis-full shadow-lg sm:shadow-none sm:hover:shadow-lg border-0.5 border-customLightGray4">
      {/* Main Card Content */}
      <div className="flex flex-col">
        <div className="flex bg-customLightGray4 p-2 rounded-md">
          <div className="pr-2">
            {item.veg_non_veg === 0 && (
              <div>
                {" "}
                <svg
                  className="min-w-14 min-h-14 md:min-w-20 md:min-h-20"
                  viewBox="0 0 81 81"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="40.5" cy="40.5" r="40.5" fill="#F2A600" />
                  <path
                    d="M7.03819 53.797C5.41412 52.6804 5.41411 50.2444 7.64721 48.9248H73.4216C74.4589 49.5518 74.8486 50.0955 75.2487 51.3609C74.9591 52.7969 74.5442 53.3851 73.4216 54.1015L7.03819 53.797Z"
                    fill="#0B1D78"
                    stroke="black"
                    strokeWidth="2"
                  />
                  <path
                    d="M71.56 48.8233C71.56 44.6617 70.6593 40.5527 69.1239 36.8459C67.5885 33.1391 65.1602 29.6341 62.3232 26.797C59.4861 23.9599 55.7781 21.6332 52.0713 20.0978C48.3645 18.5624 44.3091 17.1821 40.2968 17.1821C36.2846 17.1821 32.2292 18.5344 28.5224 20.0698C24.8156 21.6052 21.4121 23.2494 18.575 26.0865C15.4094 28.6431 13.0052 32.327 11.4698 36.0339C10.2505 38.9775 9.03369 44.8111 9.03369 48.8233H40.2968H71.56Z"
                    fill="#C0BEBE"
                  />
                  <path
                    d="M43.748 17.4587C43.748 16.7482 43.0226 15.9332 42.4931 15.4193C41.9635 14.9053 40.9381 14.4136 40.1892 14.4136C39.4404 14.4136 38.7318 14.8131 38.2022 15.3271C37.6727 15.8411 36.9473 16.7318 36.9473 17.4587H38.8297H40.503H43.748Z"
                    fill="#0B1D78"
                  />
                  <path
                    d="M29.436 28.8271C29.436 22.5485 34.5259 17.4587 40.8045 17.4587C43.2919 17.4587 45.7632 17.8598 48.123 18.6464L49.6426 19.1529C51.1246 19.6469 52.5696 20.2455 53.9669 20.9441L54.7105 21.3159L57.0451 22.5339L59.3796 24.0565L61.5112 25.8836L64.0488 28.5227C65.6705 30.6849 67.1237 32.9685 68.3956 35.3533L68.921 36.3384L69.936 38.876L70.7214 41.9193C70.739 41.9877 70.7688 42.0523 70.8093 42.1101C71.0828 42.5008 70.8032 43.0377 70.3263 43.0377H42.2255C35.1621 43.0377 29.436 37.3116 29.436 30.2482V28.8271Z"
                    fill="#D9D9D9"
                  />
                  <circle cx="59.7859" cy="32.1768" r="3.75564" fill="white" />
                  <circle cx="52.6803" cy="26.0865" r="2.33459" fill="white" />
                  <path
                    d="M25.1495 64.2832L28.0894 67.979V65.417C28.0894 65.0596 28.0382 64.8179 27.9356 64.6919C27.795 64.522 27.5592 64.4399 27.2281 64.4458V64.2832H29.1968V64.4458C28.9449 64.478 28.775 64.5205 28.6871 64.5732C28.6021 64.623 28.5347 64.7065 28.4849 64.8237C28.4381 64.938 28.4146 65.1357 28.4146 65.417V70.3784H28.2652L24.2354 65.417V69.2051C24.2354 69.5479 24.3131 69.7793 24.4683 69.8994C24.6265 70.0195 24.8067 70.0796 25.0089 70.0796H25.1495V70.2422H23.0357V70.0796C23.3638 70.0767 23.5924 70.0093 23.7213 69.8774C23.8502 69.7456 23.9146 69.5215 23.9146 69.2051V64.9995L23.7872 64.8413C23.6612 64.6831 23.5499 64.5791 23.4532 64.5293C23.3565 64.4795 23.2174 64.4517 23.0357 64.4458V64.2832H25.1495ZM32.3933 64.1997C33.3425 64.1646 34.113 64.4414 34.7048 65.0303C35.2995 65.6191 35.5969 66.356 35.5969 67.2407C35.5969 67.9966 35.3757 68.6616 34.9333 69.2358C34.3474 69.9976 33.5197 70.3784 32.4504 70.3784C31.3781 70.3784 30.549 70.0151 29.9631 69.2886C29.5002 68.7144 29.2687 68.0332 29.2687 67.2451C29.2687 66.3604 29.569 65.6235 30.1696 65.0347C30.7731 64.4429 31.5143 64.1646 32.3933 64.1997ZM32.446 64.481C31.9011 64.481 31.4865 64.7593 31.2023 65.3159C30.9709 65.7729 30.8552 66.4292 30.8552 67.2847C30.8552 68.3013 31.0339 69.0527 31.3913 69.5391C31.6403 69.8789 31.989 70.0488 32.4372 70.0488C32.739 70.0488 32.9909 69.9756 33.1931 69.8291C33.4509 69.6416 33.6516 69.3428 33.7951 68.9326C33.9387 68.5195 34.0104 67.9819 34.0104 67.3198C34.0104 66.5317 33.9372 65.9429 33.7907 65.5532C33.6442 65.1606 33.4567 64.8838 33.2282 64.7227C33.0026 64.5615 32.7419 64.481 32.446 64.481ZM37.6683 64.2832L40.6082 67.979V65.417C40.6082 65.0596 40.5569 64.8179 40.4544 64.6919C40.3138 64.522 40.0779 64.4399 39.7469 64.4458V64.2832H41.7156V64.4458C41.4637 64.478 41.2938 64.5205 41.2059 64.5732C41.1209 64.623 41.0535 64.7065 41.0037 64.8237C40.9569 64.938 40.9334 65.1357 40.9334 65.417V70.3784H40.784L36.7542 65.417V69.2051C36.7542 69.5479 36.8319 69.7793 36.9871 69.8994C37.1453 70.0195 37.3255 70.0796 37.5277 70.0796H37.6683V70.2422H35.5545V70.0796C35.8826 70.0767 36.1111 70.0093 36.2401 69.8774C36.369 69.7456 36.4334 69.5215 36.4334 69.2051V64.9995L36.306 64.8413C36.18 64.6831 36.0687 64.5791 35.972 64.5293C35.8753 64.4795 35.7361 64.4517 35.5545 64.4458V64.2832H37.6683ZM44.2177 68.6294H41.6557V67.7197H44.2177V68.6294ZM50.3453 64.2832V64.4458C50.1285 64.481 49.9351 64.5967 49.7652 64.793C49.6421 64.9395 49.459 65.2837 49.2159 65.8257L47.1636 70.3784H47.0186L44.9752 65.6411C44.7291 65.0698 44.5635 64.7344 44.4786 64.6348C44.3965 64.5352 44.2398 64.4722 44.0084 64.4458V64.2832H46.8648V64.4458H46.7681C46.5103 64.4458 46.3345 64.478 46.2408 64.5425C46.1734 64.5864 46.1397 64.6509 46.1397 64.7358C46.1397 64.7886 46.1514 64.8516 46.1749 64.9248C46.1983 64.9951 46.2774 65.187 46.4122 65.5005L47.6822 68.4668L48.8599 65.8257C49.0005 65.5063 49.087 65.2925 49.1192 65.1841C49.1514 65.0757 49.1675 64.9834 49.1675 64.9072C49.1675 64.8193 49.1441 64.7417 49.0972 64.6743C49.0503 64.6069 48.9815 64.5557 48.8907 64.5205C48.7647 64.4707 48.5977 64.4458 48.3897 64.4458V64.2832H50.3453ZM52.3991 64.626V67.0518H52.5177C52.8957 67.0518 53.1696 66.9331 53.3395 66.6958C53.5094 66.4585 53.6178 66.1084 53.6647 65.6455H53.8317V68.7656H53.6647C53.6296 68.4258 53.5549 68.1475 53.4406 67.9307C53.3293 67.7139 53.1989 67.5688 53.0495 67.4956C52.9001 67.4194 52.6833 67.3813 52.3991 67.3813V69.0601C52.3991 69.3882 52.4123 69.5889 52.4386 69.6621C52.4679 69.7354 52.5207 69.7954 52.5968 69.8423C52.673 69.8892 52.7961 69.9126 52.966 69.9126H53.3219C53.8786 69.9126 54.3239 69.7837 54.6579 69.5259C54.9948 69.2681 55.2365 68.8755 55.383 68.3481H55.5456L55.2775 70.2422H50.1271V70.0796H50.3249C50.4977 70.0796 50.6369 70.0488 50.7424 69.9873C50.8185 69.9463 50.8771 69.876 50.9181 69.7764C50.9504 69.7061 50.9665 69.5215 50.9665 69.2227V65.3027C50.9665 65.0332 50.9592 64.8677 50.9445 64.8062C50.9152 64.7036 50.861 64.6245 50.7819 64.5688C50.6706 64.4868 50.5182 64.4458 50.3249 64.4458H50.1271V64.2832H55.1149V66.0454H54.9479C54.863 65.6147 54.7428 65.3057 54.5876 65.1182C54.4352 64.9307 54.2184 64.793 53.9372 64.7051C53.7731 64.6523 53.4655 64.626 53.0143 64.626H52.3991ZM61.6643 64.147V66.2476H61.5018C61.3055 65.6733 61.011 65.2368 60.6185 64.938C60.2259 64.6392 59.7967 64.4897 59.3309 64.4897C58.8855 64.4897 58.5149 64.6157 58.219 64.8677C57.9231 65.1167 57.7137 65.4653 57.5906 65.9136C57.4676 66.3618 57.406 66.8218 57.406 67.2935C57.406 67.8647 57.4734 68.3657 57.6082 68.7964C57.743 69.2271 57.9598 69.5435 58.2586 69.7456C58.5603 69.9478 58.9178 70.0488 59.3309 70.0488C59.4744 70.0488 59.6209 70.0342 59.7703 70.0049C59.9226 69.9727 60.0779 69.9272 60.2361 69.8687V68.6294C60.2361 68.395 60.22 68.2441 60.1878 68.1768C60.1556 68.1064 60.0882 68.0435 59.9856 67.9878C59.886 67.9321 59.7644 67.9043 59.6209 67.9043H59.4671V67.7417H62.3631V67.9043C62.1434 67.9189 61.9895 67.9497 61.9017 67.9966C61.8167 68.0405 61.7508 68.1152 61.7039 68.2207C61.6775 68.2764 61.6643 68.4126 61.6643 68.6294V69.8687C61.2835 70.0386 60.8865 70.166 60.4734 70.251C60.0633 70.3389 59.637 70.3828 59.1946 70.3828C58.6292 70.3828 58.159 70.3066 57.784 70.1543C57.4119 69.999 57.0823 69.7969 56.7952 69.5479C56.511 69.2959 56.2884 69.0132 56.1272 68.6997C55.9222 68.2954 55.8196 67.8428 55.8196 67.3418C55.8196 66.4453 56.1346 65.688 56.7644 65.0698C57.3943 64.4517 58.1868 64.1426 59.1419 64.1426C59.4378 64.1426 59.7044 64.166 59.9417 64.2129C60.0706 64.2363 60.2786 64.3037 60.5657 64.415C60.8558 64.5234 61.0271 64.5776 61.0799 64.5776C61.1619 64.5776 61.2381 64.5483 61.3084 64.4897C61.3787 64.4282 61.4432 64.314 61.5018 64.147H61.6643Z"
                    fill="black"
                  />
                </svg>
              </div>
            )}
            {item.veg_non_veg === 1 && (
              <div>
                <svg
                  className="min-w-14 min-h-14 md:min-w-20 md:min-h-20"
                  viewBox="0 0 82 82"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="40.855" cy="41" r="40.5" fill="#38B000" />
                  <path
                    d="M7.39318 54.297C5.76911 53.1804 5.7691 50.7444 8.0022 49.4248H73.7766C74.8139 50.0518 75.2036 50.5955 75.6037 51.8609C75.3141 53.2969 74.8992 53.8851 73.7766 54.6015L7.39318 54.297Z"
                    fill="#0B1D78"
                    stroke="black"
                    strokeWidth="2"
                  />
                  <path
                    d="M71.9151 49.3233C71.9151 45.1617 71.0145 41.0527 69.479 37.3459C67.9436 33.6391 65.5154 30.1341 62.6783 27.297C59.8412 24.4599 56.1332 22.1332 52.4264 20.5978C48.7196 19.0624 44.6642 17.6821 40.652 17.6821C36.6397 17.6821 32.5844 19.0344 28.8775 20.5698C25.1707 22.1052 21.7672 23.7494 18.9302 26.5865C15.7645 29.1431 13.3603 32.827 11.8249 36.5339C10.6056 39.4775 9.38882 45.3111 9.38882 49.3233H40.652H71.9151Z"
                    fill="#C0BEBE"
                  />
                  <path
                    d="M44.1031 17.9587C44.1031 17.2482 43.3777 16.4332 42.8481 15.9193C42.3186 15.4053 41.2932 14.9136 40.5443 14.9136C39.7954 14.9136 39.0868 15.3131 38.5573 15.8271C38.0278 16.3411 37.3024 17.2318 37.3024 17.9587H39.1848H40.8581H44.1031Z"
                    fill="#0B1D78"
                  />
                  <path
                    d="M29.7911 29.3271C29.7911 23.0485 34.8809 17.9587 41.1595 17.9587C43.647 17.9587 46.1182 18.3598 48.478 19.1464L49.9976 19.6529C51.4796 20.1469 52.9247 20.7455 54.3219 21.4441L55.0655 21.8159L57.4001 23.0339L59.7347 24.5565L61.8663 26.3836L64.4039 29.0227C66.0255 31.1849 67.4787 33.4685 68.7506 35.8533L69.276 36.8384L70.2911 39.376L71.0764 42.4193C71.0941 42.4877 71.1238 42.5523 71.1643 42.6101C71.4378 43.0008 71.1583 43.5377 70.6813 43.5377H42.5805C35.5171 43.5377 29.7911 37.8116 29.7911 30.7482V29.3271Z"
                    fill="#D9D9D9"
                  />
                  <circle cx="60.1407" cy="32.6768" r="3.75564" fill="white" />
                  <circle cx="53.0354" cy="26.5865" r="2.33459" fill="white" />
                  <path
                    d="M40.1852 64.7832V64.9458C39.9684 64.981 39.7751 65.0967 39.6052 65.293C39.4821 65.4395 39.299 65.7837 39.0558 66.3257L37.0036 70.8784H36.8586L34.8151 66.1411C34.569 65.5698 34.4035 65.2344 34.3185 65.1348C34.2365 65.0352 34.0798 64.9722 33.8483 64.9458V64.7832H36.7048V64.9458H36.6081C36.3503 64.9458 36.1745 64.978 36.0807 65.0425C36.0134 65.0864 35.9797 65.1509 35.9797 65.2358C35.9797 65.2886 35.9914 65.3516 36.0148 65.4248C36.0383 65.4951 36.1174 65.687 36.2521 66.0005L37.5221 68.9668L38.6999 66.3257C38.8405 66.0063 38.9269 65.7925 38.9592 65.6841C38.9914 65.5757 39.0075 65.4834 39.0075 65.4072C39.0075 65.3193 38.9841 65.2417 38.9372 65.1743C38.8903 65.1069 38.8215 65.0557 38.7306 65.0205C38.6047 64.9707 38.4377 64.9458 38.2297 64.9458V64.7832H40.1852ZM42.2391 65.126V67.5518H42.3577C42.7356 67.5518 43.0096 67.4331 43.1795 67.1958C43.3494 66.9585 43.4578 66.6084 43.5047 66.1455H43.6717V69.2656H43.5047C43.4695 68.9258 43.3948 68.6475 43.2806 68.4307C43.1692 68.2139 43.0389 68.0688 42.8895 67.9956C42.74 67.9194 42.5232 67.8813 42.2391 67.8813V69.5601C42.2391 69.8882 42.2522 70.0889 42.2786 70.1621C42.3079 70.2354 42.3606 70.2954 42.4368 70.3423C42.513 70.3892 42.636 70.4126 42.806 70.4126H43.1619C43.7186 70.4126 44.1639 70.2837 44.4979 70.0259C44.8348 69.7681 45.0765 69.3755 45.2229 68.8481H45.3855L45.1175 70.7422H39.9671V70.5796H40.1648C40.3377 70.5796 40.4769 70.5488 40.5823 70.4873C40.6585 70.4463 40.7171 70.376 40.7581 70.2764C40.7903 70.2061 40.8064 70.0215 40.8064 69.7227V65.8027C40.8064 65.5332 40.7991 65.3677 40.7845 65.3062C40.7552 65.2036 40.701 65.1245 40.6219 65.0688C40.5105 64.9868 40.3582 64.9458 40.1648 64.9458H39.9671V64.7832H44.9549V66.5454H44.7879C44.7029 66.1147 44.5828 65.8057 44.4275 65.6182C44.2752 65.4307 44.0584 65.293 43.7771 65.2051C43.6131 65.1523 43.3055 65.126 42.8543 65.126H42.2391ZM51.5043 64.647V66.7476H51.3417C51.1454 66.1733 50.851 65.7368 50.4584 65.438C50.0658 65.1392 49.6366 64.9897 49.1708 64.9897C48.7255 64.9897 48.3549 65.1157 48.059 65.3677C47.7631 65.6167 47.5536 65.9653 47.4306 66.4136C47.3075 66.8618 47.246 67.3218 47.246 67.7935C47.246 68.3647 47.3134 68.8657 47.4482 69.2964C47.5829 69.7271 47.7997 70.0435 48.0986 70.2456C48.4003 70.4478 48.7577 70.5488 49.1708 70.5488C49.3144 70.5488 49.4609 70.5342 49.6103 70.5049C49.7626 70.4727 49.9179 70.4272 50.0761 70.3687V69.1294C50.0761 68.895 50.06 68.7441 50.0278 68.6768C49.9955 68.6064 49.9281 68.5435 49.8256 68.4878C49.726 68.4321 49.6044 68.4043 49.4609 68.4043H49.3071V68.2417H52.203V68.4043C51.9833 68.4189 51.8295 68.4497 51.7416 68.4966C51.6567 68.5405 51.5907 68.6152 51.5439 68.7207C51.5175 68.7764 51.5043 68.9126 51.5043 69.1294V70.3687C51.1235 70.5386 50.7265 70.666 50.3134 70.751C49.9032 70.8389 49.477 70.8828 49.0346 70.8828C48.4692 70.8828 47.9989 70.8066 47.6239 70.6543C47.2519 70.499 46.9223 70.2969 46.6352 70.0479C46.351 69.7959 46.1283 69.5132 45.9672 69.1997C45.7621 68.7954 45.6596 68.3428 45.6596 67.8418C45.6596 66.9453 45.9745 66.188 46.6044 65.5698C47.2343 64.9517 48.0268 64.6426 48.9819 64.6426C49.2778 64.6426 49.5444 64.666 49.7817 64.7129C49.9106 64.7363 50.1186 64.8037 50.4057 64.915C50.6957 65.0234 50.8671 65.0776 50.9198 65.0776C51.0019 65.0776 51.078 65.0483 51.1484 64.9897C51.2187 64.9282 51.2831 64.814 51.3417 64.647H51.5043Z"
                    fill="black"
                  />
                </svg>
              </div>
            )}
            {item.veg_non_veg === 2 && (
              <div>
                {" "}
                <svg
                  className="min-w-14 min-h-14 md:min-w-20 md:min-h-20"
                  viewBox="0 0 82 82"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="40.855" cy="41" r="40.5" fill="#9747FF" />
                  <path
                    d="M7.39318 54.297C5.76911 53.1804 5.7691 50.7444 8.0022 49.4248H73.7766C74.8139 50.0518 75.2036 50.5955 75.6037 51.8609C75.3141 53.2969 74.8992 53.8851 73.7766 54.6015L7.39318 54.297Z"
                    fill="#0B1D78"
                    stroke="black"
                    strokeWidth="2"
                  />
                  <path
                    d="M71.9151 49.3233C71.9151 45.1617 71.0145 41.0527 69.479 37.3459C67.9436 33.6391 65.5154 30.1341 62.6783 27.297C59.8412 24.4599 56.1332 22.1332 52.4264 20.5978C48.7196 19.0624 44.6642 17.6821 40.652 17.6821C36.6397 17.6821 32.5844 19.0344 28.8775 20.5698C25.1707 22.1052 21.7672 23.7494 18.9302 26.5865C15.7645 29.1431 13.3603 32.827 11.8249 36.5339C10.6056 39.4775 9.38882 45.3111 9.38882 49.3233H40.652H71.9151Z"
                    fill="#C0BEBE"
                  />
                  <path
                    d="M44.1031 17.9587C44.1031 17.2482 43.3777 16.4332 42.8481 15.9193C42.3186 15.4053 41.2932 14.9136 40.5443 14.9136C39.7954 14.9136 39.0868 15.3131 38.5573 15.8271C38.0278 16.3411 37.3024 17.2318 37.3024 17.9587H39.1848H40.8581H44.1031Z"
                    fill="#0B1D78"
                  />
                  <path
                    d="M29.7911 29.3271C29.7911 23.0485 34.8809 17.9587 41.1595 17.9587C43.647 17.9587 46.1182 18.3598 48.478 19.1464L49.9976 19.6529C51.4796 20.1469 52.9247 20.7455 54.3219 21.4441L55.0655 21.8159L57.4001 23.0339L59.7347 24.5565L61.8663 26.3836L64.4039 29.0227C66.0255 31.1849 67.4787 33.4685 68.7506 35.8533L69.276 36.8384L70.2911 39.376L71.0764 42.4193C71.0941 42.4877 71.1238 42.5523 71.1643 42.6101C71.4378 43.0008 71.1583 43.5377 70.6813 43.5377H42.5805C35.5171 43.5377 29.7911 37.8116 29.7911 30.7482V29.3271Z"
                    fill="#D9D9D9"
                  />
                  <circle cx="60.1407" cy="32.6768" r="3.75564" fill="white" />
                  <circle cx="53.0354" cy="26.5865" r="2.33459" fill="white" />
                  <path
                    d="M34.1763 64.7832V64.9458C33.9595 64.981 33.7662 65.0967 33.5963 65.293C33.4732 65.4395 33.2901 65.7837 33.0469 66.3257L30.9947 70.8784H30.8497L28.8062 66.1411C28.5601 65.5698 28.3946 65.2344 28.3096 65.1348C28.2276 65.0352 28.0709 64.9722 27.8394 64.9458V64.7832H30.6959V64.9458H30.5992C30.3414 64.9458 30.1656 64.978 30.0718 65.0425C30.0045 65.0864 29.9708 65.1509 29.9708 65.2358C29.9708 65.2886 29.9825 65.3516 30.0059 65.4248C30.0294 65.4951 30.1085 65.687 30.2432 66.0005L31.5132 68.9668L32.691 66.3257C32.8316 66.0063 32.918 65.7925 32.9503 65.6841C32.9825 65.5757 32.9986 65.4834 32.9986 65.4072C32.9986 65.3193 32.9752 65.2417 32.9283 65.1743C32.8814 65.1069 32.8126 65.0557 32.7217 65.0205C32.5958 64.9707 32.4288 64.9458 32.2208 64.9458V64.7832H34.1763ZM36.2302 65.126V67.5518H36.3488C36.7267 67.5518 37.0007 67.4331 37.1706 67.1958C37.3405 66.9585 37.4489 66.6084 37.4958 66.1455H37.6628V69.2656H37.4958C37.4606 68.9258 37.3859 68.6475 37.2717 68.4307C37.1603 68.2139 37.03 68.0688 36.8805 67.9956C36.7311 67.9194 36.5143 67.8813 36.2302 67.8813V69.5601C36.2302 69.8882 36.2433 70.0889 36.2697 70.1621C36.299 70.2354 36.3517 70.2954 36.4279 70.3423C36.5041 70.3892 36.6271 70.4126 36.7971 70.4126H37.153C37.7096 70.4126 38.155 70.2837 38.4889 70.0259C38.8259 69.7681 39.0676 69.3755 39.214 68.8481H39.3766L39.1086 70.7422H33.9582V70.5796H34.1559C34.3288 70.5796 34.4679 70.5488 34.5734 70.4873C34.6496 70.4463 34.7082 70.376 34.7492 70.2764C34.7814 70.2061 34.7975 70.0215 34.7975 69.7227V65.8027C34.7975 65.5332 34.7902 65.3677 34.7756 65.3062C34.7463 65.2036 34.6921 65.1245 34.613 65.0688C34.5016 64.9868 34.3493 64.9458 34.1559 64.9458H33.9582V64.7832H38.946V66.5454H38.779C38.694 66.1147 38.5739 65.8057 38.4186 65.6182C38.2663 65.4307 38.0495 65.293 37.7682 65.2051C37.6042 65.1523 37.2966 65.126 36.8454 65.126H36.2302ZM45.4954 64.647V66.7476H45.3328C45.1365 66.1733 44.8421 65.7368 44.4495 65.438C44.0569 65.1392 43.6277 64.9897 43.1619 64.9897C42.7166 64.9897 42.346 65.1157 42.0501 65.3677C41.7542 65.6167 41.5447 65.9653 41.4217 66.4136C41.2986 66.8618 41.2371 67.3218 41.2371 67.7935C41.2371 68.3647 41.3045 68.8657 41.4393 69.2964C41.574 69.7271 41.7908 70.0435 42.0896 70.2456C42.3914 70.4478 42.7488 70.5488 43.1619 70.5488C43.3055 70.5488 43.452 70.5342 43.6014 70.5049C43.7537 70.4727 43.909 70.4272 44.0672 70.3687V69.1294C44.0672 68.895 44.0511 68.7441 44.0188 68.6768C43.9866 68.6064 43.9192 68.5435 43.8167 68.4878C43.7171 68.4321 43.5955 68.4043 43.452 68.4043H43.2981V68.2417H46.1941V68.4043C45.9744 68.4189 45.8206 68.4497 45.7327 68.4966C45.6478 68.5405 45.5818 68.6152 45.535 68.7207C45.5086 68.7764 45.4954 68.9126 45.4954 69.1294V70.3687C45.1146 70.5386 44.7176 70.666 44.3045 70.751C43.8943 70.8389 43.4681 70.8828 43.0257 70.8828C42.4603 70.8828 41.99 70.8066 41.615 70.6543C41.243 70.499 40.9134 70.2969 40.6263 70.0479C40.3421 69.7959 40.1194 69.5132 39.9583 69.1997C39.7532 68.7954 39.6507 68.3428 39.6507 67.8418C39.6507 66.9453 39.9656 66.188 40.5955 65.5698C41.2254 64.9517 42.0179 64.6426 42.9729 64.6426C43.2688 64.6426 43.5354 64.666 43.7728 64.7129C43.9017 64.7363 44.1097 64.8037 44.3968 64.915C44.6868 65.0234 44.8582 65.0776 44.9109 65.0776C44.993 65.0776 45.0691 65.0483 45.1395 64.9897C45.2098 64.9282 45.2742 64.814 45.3328 64.647H45.4954ZM49.54 69.0459H47.435L47.1845 69.626C47.1025 69.8193 47.0614 69.979 47.0614 70.105C47.0614 70.272 47.1288 70.395 47.2636 70.4741C47.3427 70.521 47.5375 70.5562 47.8481 70.5796V70.7422H45.8661V70.5796C46.08 70.5474 46.2558 70.4595 46.3935 70.3159C46.5312 70.1694 46.7011 69.8691 46.9032 69.415L49.0346 64.6602H49.1181L51.267 69.5469C51.4721 70.0098 51.6405 70.3013 51.7724 70.4214C51.872 70.5122 52.0126 70.5649 52.1943 70.5796V70.7422H49.3114V70.5796H49.4301C49.6615 70.5796 49.8241 70.5474 49.9179 70.4829C49.9823 70.436 50.0146 70.3687 50.0146 70.2808C50.0146 70.228 50.0058 70.1738 49.9882 70.1182C49.9823 70.0918 49.9384 69.9819 49.8564 69.7886L49.54 69.0459ZM49.3905 68.7207L48.5029 66.6685L47.5888 68.7207H49.3905ZM54.0459 64.7832L56.9859 68.479V65.917C56.9859 65.5596 56.9346 65.3179 56.8321 65.1919C56.6914 65.022 56.4556 64.9399 56.1246 64.9458V64.7832H58.0933V64.9458C57.8413 64.978 57.6714 65.0205 57.5835 65.0732C57.4986 65.123 57.4312 65.2065 57.3814 65.3237C57.3345 65.438 57.3111 65.6357 57.3111 65.917V70.8784H57.1617L53.1319 65.917V69.7051C53.1319 70.0479 53.2095 70.2793 53.3648 70.3994C53.523 70.5195 53.7032 70.5796 53.9053 70.5796H54.0459V70.7422H51.9322V70.5796C52.2603 70.5767 52.4888 70.5093 52.6177 70.3774C52.7466 70.2456 52.8111 70.0215 52.8111 69.7051V65.4995L52.6836 65.3413C52.5577 65.1831 52.4463 65.0791 52.3496 65.0293C52.253 64.9795 52.1138 64.9517 51.9322 64.9458V64.7832H54.0459Z"
                    fill="black"
                  />
                </svg>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 basis-full">
            <h1 className="font-bold text-2xl md:text-3xl break-words">
              {item.name}
            </h1>
            <h2 className="flex items-center font-bold text-xl text-gray-700">
              <FaRupeeSign  className="text-gray-700" />{" "}
              <span>{item.price} only</span>
            </h2>
            <div>
              <span className="font-bold text-base">
                Ingredients:{" "}
                <span className="font-normal text-sm md:text-base">
                  {item.ingredients}
                </span>
              </span>
            </div>
          </div>
          <div className="basis-1/5 lg:basis-1/4 flex flex-col items-center justify-between gap-5">
            <div
              style={
                item.quantity === 0
                  ? { backgroundColor: "red" }
                  : item.total > item.quantity && item.quantity > 0
                  ? { backgroundColor: "blue" }
                  : item.quantity === item.total
                  ? { backgroundColor: "#38B000" }
                  : {}
              }
              className="text-white min-h-8 w-20 lg:w-24 text-lg rounded-md flex justify-center items-center"
            >
              <span className="text-sm lg:text-base flex flex-row">
                {item.quantity} / {item.total} left
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEditClick(item.id)}
                className="bg-customGray p-1 lg:p-2 items-center justify-centers rounded-sm lg:rounded-md border-1 border-black"
              >
                <FaEdit className="text-xl lg:text-2xl text-white" />
              </button>
              <button
                onClick={() => setdeletepopupVisible(true)}
                className="bg-red-600 p-1 lg:p-2 items-center justify-centers rounded-sm lg:rounded-md border-1 border-black"
              >
                <MdDelete className="text-xl lg:text-2xl text-white" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="font-bold text-xl md:text-2xl">
            Category:{" "}
            <span className="font-normal break-words">
              {item.category === 0 && "Starters"}
              {item.category === 1 && "Main Course"}
              {item.category === 2 && "Desserts"}
            </span>
          </div>
          <div className="font-bold text-xl md:text-2xl">
            Allergens:{" "}
            <span className="font-normal break-words">{item.allergens}</span>
          </div>
        </div>
      </div>

      {/* Delete Popup */}
      <Popup trigger={isdeletepopupVisible} onClose={handledeleteClosePopup}>
        <div className="flex gap-3 flex-col">
          {/* Confirmation Message */}
          <div className="text-xl">
            Are you sure to delete{" "}
            <span className="text-red-600">{item.name}</span>?
          </div>

          {/* Conditional Rendering for Buttons */}
          {deletebut && (
            <div className="flex flex-row justify-center items-center gap-4 mt-3">
              <button
                className="text-xl w-32 h-10 rounded-sm border border-customLightGray3 hover:border-black"
                onClick={() => setdeletepopupVisible(false)}
              >
                Cancel
              </button>

              <button
                onClick={() => handleDeleteItem(item.id)}
                className="text-xl bg-red-600 text-white w-32 h-10 rounded-sm hover:bg-red-400"
              >
                Delete
              </button>
            </div>
          )}

          {/* Conditional Rendering for Loading Spinner */}
          {deleteloading && (
            <div className="flex justify-center mt-4">
              <div aria-label="Loading..." role="status">
                <svg
                  className="h-10 w-10 animate-spin text-red-600"
                  viewBox="0 0 256 256"
                >
                  <circle
                    cx="128"
                    cy="128"
                    r="100"
                    strokeWidth="16"
                    stroke="red"
                    fill="none"
                    strokeDasharray="314"
                    strokeDashoffset="0"
                  ></circle>
                </svg>
              </div>
            </div>
          )}
        </div>
      </Popup>

      {/* Edit Popup */}
      <Popup trigger={isProductEditPopupVisible} onClose={handleClosePopup}>
        <div className="flex-col gap-3 justify-center border-2 border-customLightGray4 p-2 shadow-lg shadow-customLightGray4">
          <h1 className="text-center font-bold text-4xl py-5">Edit Food</h1>
          <form
            action=""
            className="flex-col space-y-4"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Food Name */}
            <div className="flex gap-3 items-center">
              <label htmlFor="foodName" className="w-1/4">
                Name:
              </label>
              <div>
                <input
                  required
                  id="foodName"
                  type="text"
                  placeholder="Enter the food name"
                  value={editFoodName}
                  onChange={(e) => setEditFoodName(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
                />
                {editFoodExists && (
                  <span>
                    <h1 className="text-red-500">
                      {editFoodName} already exists
                    </h1>
                  </span>
                )}
              </div>
            </div>

            {/* Food Price */}
            <div className="flex gap-3 items-center">
              <label htmlFor="foodPrice" className="w-1/4">
                Price:
              </label>
              <input
                required
                id="foodPrice"
                type="number"
                placeholder="Enter the food price"
                min={0.01}
                step={0.01}
                value={foodPrice}
                onChange={(e) => setFoodPrice(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Dietary Choice */}
            <div className="flex gap-3 items-center">
              <label htmlFor="foodveg_non_veg" className="w-1/4">
                Dietary Choice:
              </label>
              <select
                required
                id="foodveg_non_veg"
                value={foodveg_non_veg}
                onChange={(e) => setFoodveg_non_veg(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
              >
                <option value="0">NON-VEG</option>
                <option value="1">VEG</option>
                <option value="2">VEGAN</option>
              </select>
            </div>

            {/* Food Category */}
            <div className="flex gap-3 items-center">
              <label htmlFor="foodcategory" className="w-1/4">
                Category:
              </label>
              <select
                required
                id="foodcategory"
                value={foodcategory}
                onChange={(e) => setfoodcategory(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
              >
                <option value="0">STARTERS</option>
                <option value="1">MAIN COURSE</option>
                <option value="2">DESSERTS</option>
              </select>
            </div>

            {/* Food Quantity */}
            <div className="flex gap-3 items-center">
              <label htmlFor="foodQuantity" className="w-1/4">
                Available Quantity:
              </label>
              <input
                required
                id="foodQuantity"
                type="number"
                placeholder="Enter the available food quantity"
                min={0}
                value={foodQuantity}
                onChange={(e) => setFoodQuantity(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
              />
              {invalidQuantity && (
                <span>
                  <h1 className="text-red-500">Invalid quantity</h1>
                </span>
              )}
            </div>

            {/* Total Quantity */}
            <div className="flex gap-3 items-center">
              <label htmlFor="foodTotal" className="w-1/4">
                Total Quantity:
              </label>
              <input
                required
                id="foodTotal"
                type="number"
                placeholder="Enter the total food quantity"
                min={1}
                value={foodTotal}
                onChange={(e) => setFoodTotal(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Ingredients */}
            <div className="flex gap-3 items-center">
              <label htmlFor="foodIngredients" className="w-1/4">
                Ingredients:
              </label>
              <textarea
                required
                id="foodIngredients"
                placeholder="Enter the ingredients"
                value={foodIngredients}
                onChange={(e) => setFoodIngredients(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md h-24"
              />
            </div>

            {/* Allergens */}
            <div className="flex gap-3 items-center">
              <label htmlFor="foodAllergens" className="w-1/4">
                Allergens:
              </label>
              <div className="flex items-center gap-2">
                {allergensList.map((allergen) => (
                  <label key={allergen}>
                    <input
                      type="checkbox"
                      value={allergen}
                      checked={selectedAllergens.includes(allergen)}
                      onChange={handleCheckboxChange}
                      required
                    />
                    {allergen}
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 justify-center">
              {editbut && (
                <button
                  type="submit"
                  onClick={() => handleEditItem()}
                  className="text-xl bg-slate-950 text-white w-32 h-10 rounded-sm hover:bg-customGray"
                >
                  Edit
                </button>
              )}

              {editloding && (
                <div className="flex justify-center">
                  <svg
                    className="h-10 animate-spin stroke-black text-center"
                    viewBox="0 0 256 256"
                  >
                    <circle
                      cx="128"
                      cy="128"
                      r="100"
                      strokeWidth="16"
                      stroke="black"
                      fill="none"
                      strokeDasharray="314"
                      strokeDashoffset="0"
                    ></circle>
                  </svg>
                </div>
              )}
            </div>
          </form>
        </div>
      </Popup>
    </div>
  );
};
