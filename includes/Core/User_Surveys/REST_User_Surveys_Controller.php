<?php
/**
 * Class Google\Site_Kit\Core\User_Surveys\REST_User_Surveys_Controller
 *
 * @package   Google\Site_Kit\Core\User_Surveys
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://sitekit.withgoogle.com
 */

namespace Google\Site_Kit\Core\User_Surveys;

use Google\Site_Kit\Core\Authentication\Authentication;
use Google\Site_Kit\Core\REST_API\REST_Route;
use WP_REST_Request;
use WP_REST_Server;

/**
 * Class for handling user survey rest routes.
 *
 * @since n.e.x.t
 * @access private
 * @ignore
 */
class REST_User_Surveys_Controller {

	/**
	 * Authentication instance.
	 *
	 * @since n.e.x.t
	 * @var Authentication
	 */
	protected $authentication;

	/**
	 * Constructor.
	 *
	 * @since n.e.x.t
	 *
	 * @param Authentication $authentication Authentication instance.
	 */
	public function __construct( Authentication $authentication ) {
		$this->authentication = $authentication;
	}

	/**
	 * Registers functionality through WordPress hooks.
	 *
	 * @since n.e.x.t
	 */
	public function register() {
		add_filter(
			'googlesitekit_rest_routes',
			function ( $routes ) {
				return array_merge( $routes, $this->get_rest_routes() );
			}
		);
	}


	/**
	 * Gets REST route instances.
	 *
	 * @since n.e.x.t
	 *
	 * @return REST_Route[] List of REST_Route objects.
	 */
	protected function get_rest_routes() {
		$can_authenticate = function () {
			return $this->authentication->is_authenticated()
				&& $this->authentication->credentials()->using_proxy();
		};

		return array(
			'survey-trigger' => new REST_Route(
				'core/user/data/survey-trigger',
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => function ( WP_REST_Request $request ) {
						$proxy = $this->authentication->get_google_proxy();
						$creds = $this->authentication->credentials();
						$token = $this->authentication->get_oauth_client()->get_access_token();
						$data  = $request->get_param( 'data' );

						$response = $proxy->send_survey_trigger( $creds, $token, $data['triggerID'] );
						$response = rest_ensure_response( $response );

						return $response;
					},
					'permission_callback' => $can_authenticate,
					'args'                => array(
						'data' => array(
							'type'       => 'object',
							'required'   => true,
							'properties' => array(
								'triggerID' => array(
									'type'     => 'string',
									'required' => true,
								),
							),
						),
					),
				)
			),
			'survey-event'   => new REST_Route(
				'core/user/data/survey-event',
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => function ( WP_REST_Request $request ) {
						$proxy = $this->authentication->get_google_proxy();
						$creds = $this->authentication->credentials();
						$token = $this->authentication->get_oauth_client()->get_access_token();
						$data  = $request->get_param( 'data' );

						$response = $proxy->send_survey_event( $creds, $token, $data['session'], $data['event'] );
						$response = rest_ensure_response( $response );

						return $response;
					},
					'permission_callback' => $can_authenticate,
					'args'                => array(
						'data' => array(
							'type'       => 'object',
							'required'   => true,
							'properties' => array(
								'session' => array(
									'type'       => 'object',
									'required'   => true,
									'properties' => array(
										'session_id'    => array(
											'type'     => 'string',
											'required' => true,
										),
										'session_token' => array(
											'type'     => 'string',
											'required' => true,
										),
									),
								),
								'event'   => array(
									'type'       => 'object',
									'required'   => true,
									'properties' => array(
										'survey_shown'     => array(
											'type' => 'object',
										),
										'survey_closed'    => array(
											'type' => 'object',
										),
										'question_answered' => array(
											'type' => 'object',
										),
										'completion_shown' => array(
											'type' => 'object',
										),
										'follow_up_link_clicked' => array(
											'type' => 'object',
										),
									),
								),
							),
						),
					),
				)
			),
		);
	}

}
