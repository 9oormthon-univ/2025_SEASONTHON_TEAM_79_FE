import styled from "styled-components";

const PageContainer = styled.div`
    width: 375px;
    height: 812px;
    margin: 0 auto;
    border: 1px solid #ccc;
    overflow: hidden;
`;

export default function Layout({ children }) {
    return <PageContainer>{children}</PageContainer>;
}