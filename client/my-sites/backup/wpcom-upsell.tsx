/**
 * External dependencies
 */
import React, { ReactElement } from 'react';
import { translate } from 'i18n-calypso';
import { useSelector } from 'react-redux';

/**
 * Internal dependencies
 */
import DocumentHead from 'components/data/document-head';
import Main from 'components/main';
import SidebarNavigation from 'my-sites/sidebar-navigation';
import PageViewTracker from 'lib/analytics/page-view-tracker';
import { isPersonalPlan, isPremiumPlan } from 'lib/plans';
import FormattedHeader from 'components/formatted-header';
import PromoSection, { Props as PromoSectionProps } from 'components/promo-section';
import PromoCard from 'components/promo-section/promo-card';
import PromoCardCTA from 'components/promo-section/promo-card/cta';
import useTrackCallback from 'lib/jetpack/use-track-callback';
import Gridicon from 'components/gridicon';
import { getSitePlan } from 'state/sites/selectors';
import { getSelectedSiteId, getSelectedSiteSlug } from 'state/ui/selectors';
import MaterialIcon from 'components/material-icon';
import WhatIsJetpack from 'components/jetpack/what-is-jetpack';

/**
 * Asset dependencies
 */
import JetpackBackupSVG from 'assets/images/illustrations/jetpack-backup.svg';
import './style.scss';

const trackEventName = 'calypso_jetpack_backup_business_upsell';

const promos = [
	{
		title: translate( 'Jetpack Scan' ),
		body: translate(
			'Scan gives you automated scanning and one-click fixes to keep your site ahead of security threats.'
		),
		image: <MaterialIcon icon="security" className="backup__upsell-icon" />,
	},
	{
		title: translate( 'Activity Log' ),
		body: translate(
			'A complete record of everything that happens on your site, with history that spans over 30 days.'
		),
		image: <Gridicon icon="history" className="backup__upsell-icon" />,
	},
];

export default function WPCOMUpsellPage(): ReactElement {
	const onUpgradeClick = useTrackCallback( undefined, trackEventName );
	const siteSlug = useSelector( getSelectedSiteSlug );
	const siteId = useSelector( getSelectedSiteId );
	const { product_slug: planSlug } = useSelector( ( state ) => getSitePlan( state, siteId ) );

	// Don't show the Activity Log promo for Personal or Premium plan owners.
	const filteredPromos: PromoSectionProps = React.useMemo( () => {
		if ( isPersonalPlan( planSlug ) || isPremiumPlan( planSlug ) ) {
			return { promos: [ promos[ 0 ] ] };
		}
		return { promos };
	}, [ planSlug ] );

	return (
		<Main className="backup__main backup__wpcom-upsell">
			<DocumentHead title="Jetpack Backup" />
			<SidebarNavigation />
			<PageViewTracker path="/backup/:site" title="Backup" />

			<FormattedHeader
				headerText={ translate( 'Jetpack Backup' ) }
				className="backup__header"
				id="backup-header"
				align="left"
			/>

			<PromoCard
				title={ translate( 'Get time travel for your site with Jetpack Backup' ) }
				image={ { path: JetpackBackupSVG } }
				isPrimary
			>
				<p>
					{ translate(
						'Backup gives you granular control over your site, with the ability to restore it to any previous state, and export it at any time.'
					) }
				</p>
				<PromoCardCTA
					cta={ {
						text: translate( 'Upgrade to Business Plan' ),
						action: {
							url: `/checkout/${ siteSlug }/business`,
							onClick: onUpgradeClick,
							selfTarget: true,
						},
					} }
				/>
			</PromoCard>

			<FormattedHeader
				headerText={ translate( 'Also included in the Business Plan' ) }
				className="backup__header"
				id="backup-subheader"
				align="left"
				isSecondary
			/>

			<PromoSection { ...filteredPromos } />

			<WhatIsJetpack />
		</Main>
	);
}