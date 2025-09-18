// src/components/RecommendedPropertiesSection.jsx
import styled from "styled-components";

const SectionContainer = styled.section`
  padding: 0 20px;
  background-color: #ffffff;
  min-height: ${(props) => (props.isEmpty ? "200px" : "auto")};
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const SectionTitle = styled.span`
  font-size: 21px;
  font-weight: 700;
  line-height: 130%;
  letter-spacing: 0px;
  color: #000000;
  margin: 0;
`;

const ViewAllButton = styled.button`
  background: none;
  border: none;
  color: #666;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    color: #3299ff;
  }
`;

const PropertiesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: ${(props) => (props.itemCount > 0 ? `${props.itemCount * 128}px` : "auto")};
  margin-bottom: 50px;
`;

const PropertyCard = styled.div`
  display: flex;
  gap: 12px;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  width: 100%;
  overflow: hidden;
`;

const PropertyImage = styled.div`
  width: 120px;
  height: 102px;
  border-radius: 8px;
  background: #ffffff;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PropertyContent = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const LocationText = styled.span`
  display: block;
  font-size: 12px;
  font-weight: 400;
  color: #757b80;
  line-height: 1.2;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PropertyNameContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 2px 0;
`;

const RoomTypeTag = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #333333;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  line-height: 1;
  flex-shrink: 0;
`;

const PropertyName = styled.span`
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #464a4d;
  line-height: 1.3;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PropertyRating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    width: 11px;
    height: 11px;
  }
  transform: translateY(-0.5px);
`;

const RatingText = styled.span`
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: #464a4d;
  line-height: 1.3;
`;

const PropertyDetails = styled.div`
  font-size: 14px;
  color: #464a4d;
  line-height: 1.3;
`;

const PropertyPrice = styled.div`
  font-size: 18px;
  font-family: Andika;
  color: #17191a;
  font-weight: 700;
  margin-top: auto;
`;

const LoginPromptMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: 500;
  color: #464a4d;
  font-size: 18px;
  width: 100%;
  height: 28px;
  padding: 158px 20px 0 20px;
`;

export default function RecommendedPropertiesSection({ properties = [], onPropertyClick, onViewAll, isLoggedIn }) {
  return (
    <SectionContainer>
      <SectionHeader>
        <SectionTitle>지역 추천 매물</SectionTitle>
        <ViewAllButton onClick={onViewAll}>전체보기</ViewAllButton>
      </SectionHeader>

      {isLoggedIn ? (
        <PropertiesList $itemCount={properties.length}>
          {properties.map((property) => (
            <PropertyCard key={property.id} onClick={() => onPropertyClick(property)}>
              <PropertyImage>
                <img src={property.image} alt={property.name} />
              </PropertyImage>

              <PropertyContent>
                <PropertyPrice>{property.deposit}</PropertyPrice>
                <PropertyDetails>
                  {property.size} {property.fee}
                </PropertyDetails>
                <PropertyNameContainer>
                  <RoomTypeTag>{property.roomType}</RoomTypeTag>
                  <PropertyName>{property.name}</PropertyName>
                </PropertyNameContainer>
                <LocationText>{property.location}</LocationText>
                <PropertyRating>
                  <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M11.5188 4.4625C11.4688 4.2625 11.3188 4.1625 11.1188 4.1125L7.91875 3.6625L6.46875 0.7625C6.31875 0.4125 5.71875 0.4125 5.56875 0.7625L4.11875 3.6625L0.91875 4.1125C0.71875 4.1125 0.56875 4.2625 0.51875 4.4625C0.46875 4.6625 0.51875 4.8625 0.66875 4.9625L2.96875 7.2125L2.41875 10.4125C2.41875 10.6125 2.41875 10.8125 2.61875 10.9125C2.76875 11.0125 2.96875 11.0625 3.16875 10.9125L6.01875 9.4125L8.86875 10.9125C8.91875 10.9125 9.01875 10.9625 9.11875 10.9625C9.21875 10.9625 9.31875 10.9625 9.41875 10.8625C9.56875 10.7625 9.66875 10.5625 9.61875 10.3625L9.06875 7.1625L11.3688 4.9125C11.5188 4.7625 11.5688 4.5625 11.5188 4.4125V4.4625Z"
                      fill="#3299FF"
                    />
                  </svg>
                  <RatingText>{property.rating}</RatingText>
                </PropertyRating>
              </PropertyContent>
            </PropertyCard>
          ))}
        </PropertiesList>
      ) : (
        <LoginPromptMessage>로그인 후 지역추천매물을 확인하세요.</LoginPromptMessage>
      )}
    </SectionContainer>
  );
}
