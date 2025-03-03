import { AccordionSummary, accordionSummaryClasses, AccordionSummaryProps, styled } from "@mui/material";

export const AccordionSummaryLeft = styled((props: AccordionSummaryProps) => (
	<AccordionSummary
		expandIcon={<i className="fa-solid fa-chevron-right"></i>}
		{...props}
	/>
))(({ theme }) => ({
	flexDirection: 'row-reverse',
	gap: '1em',
	[`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
	{
		transform: 'rotate(90deg)',
	},
	[`& .${accordionSummaryClasses.content}`]: {
		marginLeft: theme.spacing(1),
	},
	...theme.applyStyles('dark', {
		backgroundColor: 'rgba(255, 255, 255, .05)',
	}),
}));