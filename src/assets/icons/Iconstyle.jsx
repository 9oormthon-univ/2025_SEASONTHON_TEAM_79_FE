import styled from "styled-components"

const StyledIcon = styled.svg`
    path {
        fill: ${props => props.active ? '#3299FF' : '#464A4D'};

        transition: fill 0.2s ease;
    }

    &:hover path {
        fill: #3299FF;
    }
    `;

export default StyledIcon;